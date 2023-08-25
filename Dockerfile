FROM python:3.8-buster

# Install `software-properties-common` so that we can use `apt-add-repository`
# which is missing from the default Debian installation.
RUN apt-get update && apt-get install -y --no-install-recommends software-properties-common

# Install Python and all required Python packages.
RUN apt-get install -y --no-install-recommends python3 python3-pip python3-dev python3-setuptools python3-wheel

# Install any required dependencies. See ./requirements.txt for all requirements.
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip3 install -r ./requirements.txt

# Start the web server
RUN python3 src/wsgi.py
