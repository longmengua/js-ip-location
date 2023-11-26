const fs = require('fs');

function filterOut(str: string) {
  return [
    "城域网",
    "电信",
    "泛播",
    "科技网",
    "网易云",
    '教育网',
    '中華電信',
    '中电华通',
    "亚马逊云",
    "数据中心",
    "微软云",
    "阿里云",
    "优刻云",
    "谷歌云",
    "腾讯云",
    "百度云",
    "华为云",
    "电讯盈科",
    "香港宽频",
    "联通",
    "和记黄埔",
    "263网络通信",
    "西门子",
    "火山引擎"
  ].includes(str) 
}

function containsSimplifiedChinese(str: string) {
  // Unicode range for simplified Chinese characters
  const simplifiedChineseRange = /[\u4e00-\u9fff]/;

  // Test if the string contains any simplified Chinese characters
  return simplifiedChineseRange.test(str);
}

async function convertToJsonFromText() {
  const inputString: string = fs.readFileSync('./test/ip_ip138.txt', 'utf8');
  const dataArray = inputString.split(/[\n]+/)

  // Process the array of values
  const result: Record<any, {
    country: string
    city: Array<string>
  }> = {}

  dataArray.map((v, index) => {
    let country: Record<any, boolean> = {}
    v.split(/[,]+/).map((w) => {
      if (index <= 0 || !containsSimplifiedChinese(w) || filterOut(w)) return
      if (!country[index]) {
        country[index] = true
        result[index] = {
          country: w,
          city: [],
        }
      } else {
        result[index].city.push(w)
      }
    })
  })

  const reFormatData = Object.values(result).reduce((obj, v) => {
    if (obj[v.country]) {
      obj[v.country] = Array.from(new Set([...obj[v.country], ...v.city]))
    } else {
      obj[v.country] = v.city
    }
    return obj
  }, {} as Record<string, Array<string>>)

  // const toBeWroteData: Record<string, Array<string>> = {}
  // result.forEach((v) => {
  //   if (v.length > 0) {
  //     toBeWroteData[v[0]] = v.slice(1, v.length)
  //   }
  // })

  await fs.writeFile('./test/ip138.json', JSON.stringify(reFormatData), (err: any) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data has been written to');
    }
  });
}

// convert to JSON format
convertToJsonFromText()