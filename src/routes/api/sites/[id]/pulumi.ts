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

// gets info about a specific site
export const getHandler = (async ({ request }) => {
    const { id } = await request.json();
    const stackName = id;
    try {
        // select the existing stack
        const stack = await LocalWorkspace.selectStack({
            stackName,
            projectName,
            // don't need a program just to get outputs
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            program: async () => { },
        });
        const outs = await stack.outputs();
        return new Response(JSON.stringify({ id: stackName, url: outs.websiteUrl.value }));
    } catch (e) {
        if (e instanceof StackNotFoundError) {
            return new Response(`stack "${stackName}" does not exist`, { status: 404 });
        } else {
            return new Response(JSON.stringify(e), { status: 500 });
        }
    }
}) satisfies RequestHandler;

// updates the content for an existing site
export const updateHandler = (async ({ request, params }) => {
    const stackName = params?.id;
    const { content } = await request.json();
    try {
        // select the existing stack
        const stack = await LocalWorkspace.selectStack({
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
        if (e instanceof StackNotFoundError) {
            return new Response(`stack "${stackName}" does not exist`, { status: 404 });
        } else if (e instanceof ConcurrentUpdateError) {
            return new Response(`stack "${stackName}" already has update in progress`, { status: 409 });
        } else {
            return new Response(JSON.stringify(e), { status: 500 });
        }
    }
}) satisfies RequestHandler;

// deletes a site
export const deleteHandler = (async ({ params }) => {
    const stackName = params.id;
    try {
        // select the existing stack
        const stack = await LocalWorkspace.selectStack({
            stackName,
            projectName,
            // don't need a program for destroy
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            program: async () => { },
        });
        // deploy the stack, tailing the logs to console
        await stack.destroy({ onOutput: console.info });
        await stack.workspace.removeStack(stackName);
        return new Response(undefined, { status: 200 });
    } catch (e) {
        if (e instanceof StackNotFoundError) {
            return new Response(`stack "${stackName}" does not exist`, { status: 404 });
        } else if (e instanceof ConcurrentUpdateError) {
            return new Response(`stack "${stackName}" already has update in progress`, { status: 409 });
        } else {
            return new Response(JSON.stringify(e), { status: 500 });
        }
    }
}) satisfies RequestHandler;
