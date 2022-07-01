#!/bin/bash
RESULT="`wget --post-data 'a=b' --header='TRIGGERS: Alpha,Beta,Zeta' --no-check-certificate -qO- https://piranha-agenda.isi.edu:4400`"
echo $RESULT
