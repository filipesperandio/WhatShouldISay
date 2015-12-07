#!/bin/sh

set -x

echo 'running build' > /tmp/whatsholdisay

node cordova/lib/copy-www-build-step.js
