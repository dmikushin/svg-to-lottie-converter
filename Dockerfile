FROM python:3.8-buster

# Install `software-properties-common` so that we can use `apt-add-repository`
# which is missing from the default Debian installation.
RUN apt-get update && apt-get install -y --no-install-recommends software-properties-common

# Install Python and all required Python packages.
RUN apt-get install -y --no-install-recommends python3 python3-pip python3-dev python3-setuptools python3-wheel

# Install any required dependencies. See ./requirements.txt for all requirements.
WORKDIR /usr/src/app
#COPY requirements.txt ./
#RUN pip3 install -r ./requirements.txt
# TODO: Fix issues here, Docker keeps caching the ./requirements.txt and not recognising changes
# TODO: Update requirements.txt with the package list below...
RUN pip3 install numpy==1.24.0 dataclasses==0.6 CairoSVG==2.4.2 triangle==20200424 pydantic==1.6.1 matplotlib==3.3.0 uvicorn==0.11.6 fastapi==0.61.0 python-multipart==0.0.6

# Start the web server
WORKDIR /usr/src/app
COPY src ./
ENV PYTHONUNBUFFERED=1
CMD ["python3", "wsgi.py"]
