## Installation & SetUp
To set up the project locally:
1. Clone the repository:
```shell
git clone https://github.com/dwikailham/github-consume-api.git
cd github-consume-api
```

2. Create `.env` file with key value, for `NEXT_PUBLIC_ACCESS_TOKEN` is mandatory to headers at `NEXT_PUBLIC_API_HOST`, you can generate access token in link [here](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app)
```shell
NEXT_PUBLIC_API_HOST=https://api.github.com
NEXT_PUBLIC_ACCESS_TOKEN=YOUR-TOKEN
```

3. Install dependencies:
```shell
npm install
# or
yarn
```

4. Start development server
```shell
npm run dev
```

5. Access the application with your browser and navigate to [http://localhost:3000](http://localhost:3000)