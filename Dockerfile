# Tells the Docker which base image to start.
FROM node

# Adds files from the host file system into the Docker container.
#ADD . 

# Sets the current working directory for subsequent instructions
#WORKDIR .
ENV IP="10.100.112.120"

WORKDIR /home/mean


# Install Mean.JS packages
ADD package.json /home/mean/package.json  
RUN npm install

# Make everything available for start
ADD . /home/mean


#RUN npm start

#expose a port to allow external access
EXPOSE 3000

# Start mean application
CMD ["npm", "start"]
