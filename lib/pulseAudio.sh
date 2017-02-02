#!/bin/bash

audioDevice=( $(pacmd list-sources | grep -e 'name:' | head -n 1) )

echo ${audioDevice[@]}
