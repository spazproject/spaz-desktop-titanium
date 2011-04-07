#!/bin/bash

SRCPATH='~/Applications/Projects/Spaz-Titanium'
TMPPATH='/tmp/spaz'
BLDPATH='/Users/coj/Sites/spaz-builds'
TIPATH='/Users/coj/Library/Application Support/Titanium'
SDKPATH='/Users/coj/Library/Application Support/Titanium/sdk/osx/1.1.0'

BLDDATE=`date +%Y%m%d-%H%M%S%Z`

# let user know where we'll be working
echo "Source Path: ${SRCPATH}"
echo "Temp Path: ${TMPPATH}"
echo "Build Path:  ${BLDPATH}"
echo "--------------------------------------"


"${SDKPATH}/tibuild.py" -d "${BLDPATH}" -s "${TIPATH}" -r -a "${SDKPATH}" .
