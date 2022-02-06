sed -i "s/@oslabs-beta\\/expressbridge/expressbridge/g" package.json
# @oslabs-beta/expressbridge -> expresbridge

# specify delimiter
IFS='/';

# read in github.ref property
read -ra ref <<< $1

TAG_VERSION = $ref[3] 

echo $TAG_VERSION

sed -i "s/\"version.*/\"version\": \"$TAG_VERSION\",/g" package.json
