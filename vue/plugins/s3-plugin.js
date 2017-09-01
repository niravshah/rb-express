var S3Plugin = {
    install: function (Vue, options) {

        Vue.s3Init = function (callback) {

            var albumBucketName = 'raisebetter';

            var bucketRegion = 'eu-west-2';
            var IdentityPoolId = 'eu-west-2:07e95cee-5f85-4371-bdeb-d15b1090b4e0';

            try {

                AWS.config.update({
                    region: bucketRegion,
                    credentials: new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: IdentityPoolId
                    })
                });

                Vue.s3 = new AWS.S3({
                    params: {Bucket: albumBucketName}
                });

            } catch (e) {
                if (e instanceof ReferenceError) {
                    console.log('AWS is not loaded!!');
                    callback(new Error('AWS is not loaded!!'), null);
                } else {
                    callback(e, null);
                }
            }
        };

        Vue.uploadPhoto = function (photoFile, photoFileName, callback) {

            if (Vue.s3 == undefined) {
                Vue.s3Init();
            }

            Vue.s3.upload({
                Key: photoFileName,
                Body: photoFile
            }, function (err, data) {
                callback(err, data);
            });

        }
    }
};
