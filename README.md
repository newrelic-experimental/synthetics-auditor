[![New Relic Experimental header](https://github.com/newrelic/opensource-website/raw/main/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#new-relic-experimental)

# New Relic One Synthetics Auditor

## About this Nerdpack

Synthetics Auditor for New Relic One is designed for a quick view into your Synthetics usage across accounts. It uses the power of Nerdgraph and NRQL to answer your questions about your synthetics monitoring.

The goals of this app are to provide insights on:

* Synthetics usage across accounts as an overview
* Monitors creating the most billable checks (ie, non-Ping type monitors) including high frequency and high location number monitors
* Monitors that do not have alerts associated to them
* Monitors with high failure rates
* Monitors that may be underutilized for critical systems (eg, not enough locations or too infrequent)
* Audit log to show major changes to Synthetics

![Overview Tab](screenshots/overview.png)

![Most Non-ping Checks](screenshots/most-non-pings.png)

![No Alerts Tab](screenshots/no-alerts.png)

## Open Source License

This project is distributed under the [Apache 2 license](LICENSE).

## What do you need to get this to work?

The only thing you need is to have Synthetics monitors set up and running.

## Getting Started

1. Ensure that you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [NPM](https://www.npmjs.com/get-npm) installed. If you're unsure whether you have one or both of them installed, run the following commands. (If you have them installed, these commands return a version number; if not, the commands aren't recognized.)

```bash
git --version
npm -v
```

2. Install the [NR1 CLI](https://one.newrelic.com/launcher/developer-center.launcher) by going to [the developer center](https://one.newrelic.com/launcher/developer-center.launcher), and following the instructions to install and set up your New Relic development environment. This should take about 5 minutes.
3. Execute the following command to clone this repository and run the code locally against your New Relic data:

```bash
git clone https://github.com/newrelic-experimental/synthetics-auditor.git
cd synthetics-auditor
nr1 nerdpack:serve
```

Visit [https://one.newrelic.com/?nerdpacks=local](https://one.newrelic.com/?nerdpacks=local) to launch your app locally.

## Deploying this Nerdpack

> Include the necessary steps to deploy your app. Generally, you shouldn't need to change any of these steps.

Open a command prompt in the app's directory and run the following commands.

```bash
# If you need to create a new uuid for the account to which you're deploying this app, use the following
# nr1 nerdpack:uuid -g [--profile=your_profile_name]
# to see a list of APIkeys / profiles available in your development environment, run nr1 credentials:list
nr1 nerdpack:publish [--profile=your_profile_name]
nr1 nerdpack:deploy [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
nr1 nerdpack:subscribe [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
```

Visit [https://one.newrelic.com](https://one.newrelic.com), and launch your app in New Relic.

> Important Note: Upon choosing the accounts to install this nerdpack, it's recommended to select the parent account and all subaccounts. This will allow the Synthetics Auditor app to be able to see synthetics monitors across all accounts and facet down to specific accounts in the account dropdown.

## Community Support

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

[https://discuss.newrelic.com/t/synthetics-auditor](https://discuss.newrelic.com/t/synthetics-auditor)

Please do not report issues with Account Maturity to New Relic Global Technical Support. Instead, visit the [`Explorers Hub`](https://discuss.newrelic.com/c/build-on-new-relic) for troubleshooting and best-practices.

## Issues / Enhancement Requests

Issues and enhancement requests can be submitted in the [Issues tab of this repository](../../issues). Please search for and review the existing open issues before submitting a new issue.

## Security

As noted in our [security policy](https://github.com/newrelic/nr1-account-maturity/security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.
If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

# Contributing

Contributions are encouraged! If you submit an enhancement request, we'll invite you to contribute the change yourself. Please review our [Contributors Guide](CONTRIBUTING.md).

Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. If you'd like to execute our corporate CLA, or if you have any questions, please drop us an email at opensource+synthetics-auditor@newrelic.com.
