
function request(options){
  const {url,method,data,success,fail} = options;
  wx.request({
    url: url,
    method:method,
    data:data,
    success:(res)=>{
      if (res.statusCode == 200){
        let rs = res.data;
        if (rs.success){
          if (success){
            success(rs.data);
          }
        }else{
          console.log(rs.msg);
          if (fail){
            fail(rs.msg);
          }
        }
      }
    }
  })
}


module.exports = {
  request: request
}