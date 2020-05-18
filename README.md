# Tray.io Hoover Project

> Hello and welcome to my github page for the Tray.io Hoover Project Assignment!
> To see a live demo of this work, please proceed [here](http://trayhooverproject.s3-website-us-west-1.amazonaws.com/).

## Build Setup

You can start by either cloning this repo or clicking on the download button on this page and saving to a local directory. Instructions to run this app locally are below. 

Pre-requisites to run this app are:
* [Yarn](https://classic.yarnpkg.com/en/)
* [Node](https://nodejs.org/en/)

Run Instructions in dev mode:

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev
```

## Main Areas of Focus

Since this is a webapp based on vue.js and nuxt.js, javascript is scattered throughout the application across components and states. There are, however, main areas where I have written the bulk of my logic. These areas are:

* [store/result.js](https://github.com/Yoprado/TrayioHooverProject/blob/master/store/result.js): Store that holds the mutations and state variables used across my index and results vue components. In other words, these hold the main variables and functions that run the hoover logic and are heavily commented.
* [pages/index.vue](https://github.com/Yoprado/TrayioHooverProject/blob/master/pages/index.vue): Index vue component that is the landing page of this site. This page is mainly used to upload instruction files for the hoover or to load the default file. 
* [pages/result.vue](https://github.com/Yoprado/TrayioHooverProject/blob/master/pages/result.vue): Result vue component that visualizes the results of the instruction uploaded for the hoover. This comes in the form of cards that display the results as well as a chart that animates step by step instructions of the hoover run. 