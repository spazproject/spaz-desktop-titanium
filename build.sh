#!/bin/bash

SRCPATH='~/Applications/Projects/Spaz-Titanium'
TMPPATH='/tmp/spaz'
BLDPATH='/tmp'
TIPATH='/Users/coj/Library/Application Support/Titanium'
#SDKPATH='/home/coj/.titanium/sdk/linux/1.1.0'
SDKPATH='/Users/coj/Library/Application Support/Titanium/sdk/osx/1.1.0'
#SDKPATH='/Library/Application Support/Titanium/sdk/osx/1.2.0'

BLDDATE=`date +%Y%m%d-%H%M%S%Z`

# let user know where we'll be working
echo "Source Path: ${SRCPATH}"
echo "Temp Path: ${TMPPATH}"
echo "Build Path:  ${BLDPATH}"
echo "--------------------------------------"


"${SDKPATH}/tibuild.py" -d "${BLDPATH}" -s "${TIPATH}" -r -a "${SDKPATH}" .
