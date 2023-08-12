# Reproduce bug in aws-cdk-lib introduced between 2.87.0 and 2.88.0

1. Clone this repo
2. Run `npm install`
3. Run `npm run cdk synth`
4. Open the generated template `cdk.out/MyStack.template.json` and notice the logical id of the lambda version is `MyLambdaCurrentVersionE7A382CC40566d291e26de5fbeddf64c72bb9661`
5. Open `package.json` and change the version of both `aws-cdk` and `aws-csk-lib` to `2.88.0`
6. Run `npm install`
7. Run `npm run cdk synth`
8. Open the generated template `cdk.out/MyStack.template.json` and notice the logical id of the lambda version is changed to `MyLambdaCurrentVersionE7A382CC6466d36c9d15346e31eee2175be4ea3e`

The change in logical id of the lambda version causes a deployment failure by CloudFormation because nothing has been changed to the lambda function nor the layer version.

> Note: The logical id of the lambda version remains stable if the lambda function has no layers