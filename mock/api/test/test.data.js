const Mock = require('mockjs')

module.exports = {
  getTest(req, res) {
    let data = Mock.mock({
      "name": "joe",
      "phone": "13166668888"
    })

    res.json(data)
  },
}