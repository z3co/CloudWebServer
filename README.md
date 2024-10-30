# CloudWebServer
This is a selfhosted cloud, accessible through any browser on any device.
You can setup users and upload file types like jpg, png mp3, mp4 and zip files,
meaning you can upload practicly any file just compress into a zip file and you're good to go.

## Installation and usage

### Installation
It is very simple to install and setup. To install you just install the program, 
go to location of the folder and run one simple command*:
```bash
docker compose up -d --build
```
*You have to have docker compose running on your machine. Docker compose comes with docker desktop
### Usage
To access your new cloud, open your browser and go to localhost:3000.
Now press the login button and type in admin and admin in the username and password fields.

Then you should see a register button, press that and make a new user, from now on use this login to access your cloud.
Go back to the page you where on before and simply press the choose file button, choose your file. Then press the upload button,
after a refresh youy should see the name of your file popup at the bottom of the page. To install it press it.

Now you are all good to go everybody with a password can see and download the files so keep your password secret.
You can always setup a new user, when you are logged in.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
