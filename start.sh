#!/bin/bash

if [ "$ENABLE_DEBUG" == "true" ]; then
	echo "Starting with debugger on port $AUX_PORT"
	exec with_ngrok node --debug=$AUX_PORT services/index.js
else
	echo "Starting without debugger"
	exec node services/index.js
fi
