---
path: "/gh_actions"
date: "2020-02-24"
title: "GitHub Actions: First Impressions"
---

_I live! Apologies to my one reader for the tumbleweeds. Between changing jobs and some freelance stuff I can't talk about yet, I haven't had time to tinker and write about it._

### The Problem

Last time, I wrote about how I set up CodeBuild to get some CI on my blog. It was mostly done as a way to study for my AWS Professional DevOps cert _(I passed, btw/nbd)_. I liked having the automation in place, but it was rudimentary, and not a complete solution - I set up the dev branch to build to the dev environment. But deploying to production was still a manual process. Which is lame. 

So today, I decided to fix that. Well, actually, I decided to look at another problem I'm having with the analytics, but realized the rapid iteration I wanted to do for testing would be a PITA with manual deployments. So I created another `buildspec.yml` for my prod deployments, and tried to get that to work. The Code Pipeline didn't lend itself well to a Jenkins-style multibranch pipeline, so I couldn't use that as an orchestrator for `dev` => `dev`, `master` => `prod` deployments. I played with the webhook feature in CodeBuild, but I couldn't get the filters to work correctly- the dev build would fire on prod triggers and the commit ids didn't match anything in the git history, so I couldn't tell where the source code was coming from. 

### A New Challenger Approaches

![GitHub Dressed as Jenkins.](../images/jenktocat.jpg)
Enter [GitHub Actions](https://github.com/features/actions)! (For those wondering, no, I'm not considering Jenkins- I'm not interested in managing my own servers for side projects. My stance is softening- its a great tool for some use cases, but not for one programmer running one job monthly at most.) GitHub Actions is, as you might guess, GitHub's Continuous Integration tool. And best of all, its free!

### The Solution

Basically, you define a workflow IN YAML- looking at you Groovy- and when its triggered, the workflow executes. The trigger is defined in the `on` section:
```
on: 
  push:
    branches: 
      - dev
```
_(My only complaint so far is that it seems creating a PR triggers a build on the branch being merged in. Not a dealbreaker, but something that should be avoidable)_

Next, define the build job runtime. I left it as the default ubuntu image, but I'm sure a custom container could slot in here. 
```
jobs:
  build:
    runs-on: ubuntu-latest
```
Then you just define a series of `steps`, using `name`, `run`, and sometimes `with` to define the build process. I was able to make two files: `dev.yml` and `prod.yml`,  to support the multibranch deployment strategy I wanted. 

### Final Thoughts

So this is a writeup of about 3 hours of work. The good news is that I was able to go from 'GitHub Actions may be a CI solution for me' to 'Okay cool, this is working the way I want it to' in that span. The bad news is that nothing here has withstood the tests of time or user tinkering. 

I like the use of yaml, especially migrating from a yaml-based tool. I'm not sure that the yaml paradigm can support the flexibility of something like Groovy. The free price tag helps too. In an individual user or small group workflow, I think Actions is a solid CI tool. 

On the other hand, in an enterprise setting, I'm not sure I like the concept of GitHub Actions- if GitHub (or a self-hosted GitHub enterprise) goes down, not only is SCM down, but CI stops too. Keeping CI maintained separately as Jenkins or whatever means that even if GitHub goes down, Jenkins may still be able to manage some tasks using artifacts stored in Nexus or S3. 