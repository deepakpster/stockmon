let z_cookie = "", z_token = "";

module.exports = {
  getCredentials: ()=>{
    return {
      cookie: z_cookie,
      token: z_token
    }
  },
  setCredentials: (cookie, token) => {
    z_cookie = cookie;
    z_token = token;
  }
}