#!/usr/bin/env python3
# coding: utf-8

from collections import ChainMap
import os, argparse

defaults  = {
        'color': 'red',
        'user': 'guest'
        }

parser = argparse.ArgumentParser()
parser.add_argument('-u','--user')
parser.add_argument('-c', '--color')

# parse cli arguments
namespace = parser.parse_args()

# dict comprehension to create a dict from namespace
command_line_args = { k: v for k, v in vars(namespace).items() if v }

# chainmap is a class that takes multiple mappings , find key in orders of thess mappings
chainmap = ChainMap(command_line_args, os.environ, defaults)

print('color = %s' % chainmap['color'])
print('user = %s' % chainmap['user'])


