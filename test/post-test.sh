#!/bin/bash
RESULT="`wget --post-data 'a=b' --header='TRIGGERS: Alpha,Beta,Zeta' -qO- http://localhost:3000`"
echo $RESULT
