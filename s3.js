const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "mikhail-imageboard",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            console.log("amazon upload complete!");
            next();
            fs.unlink(path, () => {});
            //Optional: delete image from local storage after upload to AWS
        })
        .catch((err) => {
            // uh oh
            console.log(err);
        });
};
