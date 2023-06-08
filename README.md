# Pulumi Over Http

This example is meant to show how you can use Pulumi's Automation API to create static websites hosted on AWS. The example utilizes SvelteKit API's so that you can expose infrastructure as RESTful resources. All the infrastructure is defined in inline programs that are constructed and altered on the fly based on input parsed from user-specified POST bodies. Be sure to read through the handlers to see how Automation API detect structured error cases such as update conflicts (409), and missing stacks (404).

You will find all of the code needed inside of `src/routes/api/stacks` and `src/routes/api/stacks/[id]`.

## Pre-Requirements needed to run the example

1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/install/versions/) or later)
1. The AWS CLI, with appropriate credentials. If you are on a Mac I would highly recommend using [Brew's AWS CLI](https://formulae.brew.sh/formula/awscli) if this is a first time setup. The below setup is how you can quickly set your aws access (although this is not best practice).

```bash
 $ aws configure
 AWS Access Key ID [*************xxxx]: <Your AWS Access Key ID>
 AWS Secret Access Key [**************xxxx]: <Your AWS Secret Access Key>
 Default region name: [us-east-2]: us-east-2
 Default output format [None]: json
```

## Run example

Install necessary packages

```bash
pnpm install
```

Run Dev Environment

```bash
pnpm dev
```

## Create Site

Add this to the input box and click "Create Site" see a full page appear.

```html
<h1>Xena</h1>
<p>A domesticated, black crazy cat.</p>

<img
	src="https://media.codingcat.dev/image/upload/q_auto,f_auto,w_800/main-codingcatdev-photo/xena-blackcatui.jpg"
	alt="black cat sleeping"
/>
```
