
---
path: "/codebuild"
date: "2019-10-27"
title: "Getting Familiar with AWS CodeBuild"
---
This month, I ended up biting the bullet and going for my AWS Professional DevOps Engineer Certification. 


```
artifacts:
  files:
  - public/**/*
  discard-paths: yes
  base-directory: '.'
```
https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#runtime-versions-buildspec-file

https://docs.aws.amazon.com/codebuild/latest/userguide/sample-disable-artifact-encryption.html

https://nishantdania.com/blog/ghost-gatsby-part-4-setting-up-aws-codebuild-for-auto-deploying-the-site/

aws s3 cp ./public s3://dev.coffay.haus/ --recursive --region us-east-1 --acl public-read