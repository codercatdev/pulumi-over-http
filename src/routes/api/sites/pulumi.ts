import {
    LocalWorkspace,
    ConcurrentUpdateError,
    StackAlreadyExistsError,
    StackNotFoundError
} from "@pulumi/pulumi/automation";
import { s3 } from "@pulumi/aws";
import type { PolicyDocument } from "@pulumi/aws/iam";
import type { RequestHandler } from './$types';


const projectName = "pulumi_over_http";

// this function defines our pulumi S3 static website in terms of the content that the caller passes in.
// this allows us to dynamically deploy websites based on user defined values from the POST body.
const createPulumiProgram = (content: string) => async () => {
    // Create a bucket and expose a website index document
    const siteBucket = new s3.Bucket("s3-website-bucket", {
        website: {
            indexDocument: "index.html",
        },
    });

    // here our HTML is defined based on what the caller curries in.
    const indexContent = content;

    // write our index.html into the site bucket
    new s3.BucketObject("index", {
        bucket: siteBucket,
        content: indexContent,
        contentType: "text/html; charset=utf-8",
        key: "index.html"
    });

    // Create an S3 Bucket Policy to allow public read of all objects in bucket
    const publicReadPolicyForBucket = (bucketName: string): PolicyDocument => {
        return {
            Version: "2012-10-17",
            Statement: [{
                Effect: "Allow",
                Principal: "*",
                Action: [
                    "s3:GetObject"
                ],
                Resource: [
                    `arn:aws:s3:::${bucketName}/*` // policy refers to bucket name explicitly
                ]
            }]
        };
    }

    // Set the access policy for the bucket so all objects are readable
    new s3.BucketPolicy("bucketPolicy", {
        bucket: siteBucket.bucket, // refer to the bucket created earlier
        policy: siteBucket.bucket.apply(publicReadPolicyForBucket) // use output property `siteBucket.bucket`
    });

    return {
        websiteUrl: siteBucket.websiteEndpoint,
    };
};

// creates new sites
export const createHandler = (async ({ request }) => {
    const { id, content } = await request.json();
    const stackName = id;
    try {
        // create a new stack
        const stack = await LocalWorkspace.createStack({
            stackName,
            projectName,
            // generate our pulumi program on the fly from the POST body
            program: createPulumiProgram(content),
        });
        await stack.setConfig("aws:region", { value: "us-west-2" });
        // deploy the stack, tailing the logs to console
        const upRes = await stack.up({ onOutput: console.info });
        return new Response(JSON.stringify({ id: stackName, url: upRes.outputs.websiteUrl.value }));
    } catch (e) {
        if (e instanceof StackAlreadyExistsError) {
            return new Response(`stack "${stackName}" already exists`, { status: 409 });
        } else {
            return new Response(JSON.stringify(e), { status: 500 });
        }
    }
}) satisfies RequestHandler;

// lists all sites
export const listHandler = (async () => {
    try {
        // set up a workspace with only enough information for the list stack operations
        const ws = await LocalWorkspace.create({ projectSettings: { name: projectName, runtime: "nodejs" } });
        const stacks = await ws.listStacks();
        return new Response(JSON.stringify({ ids: stacks.map(s => s.name) }));
    } catch (e) {
        return new Response(JSON.stringify(e), { status: 500 });
    }
}) satisfies RequestHandler;
