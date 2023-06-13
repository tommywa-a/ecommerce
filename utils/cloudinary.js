const cloudinary = require('cloudinary')

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.SECRET_KEY,
})

const cloudinaryUploadImg = async (fileToUpload) => {
	return new Promise((resolve) => {
		cloudinary.UploadStream.upload(fileToUpload, (result) => {
			resolve(
				{
					url: result.secure_url,
				},
				{
					resource_type: 'auto',
				}
			)
		})
	})
}

module.exports = cloudinaryUploadImg