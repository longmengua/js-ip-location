const https = require('https')
const fs = require('fs')
const zlib = require('zlib')
const { execSync } = require('child_process')

const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' })
  } catch (error) {
    console.error(`執行命令時發生錯誤: ${error}`)
    process.exit(1)
  }
}

const compressMaxmindDB = () => {
  console.log('正在壓縮 maxmind.mmdb...')

  try {
    runCommand('zip src/ip/data/maxmind/maxmind.zip src/ip/data/maxmind/maxmind.mmdb')

    console.log('壓縮完成.')
  } catch (error) {
    console.error('壓縮時發生錯誤:', error)
    process.exit(1)
  }
  process.exit(0)
}

const downloadMaxmindDB = async () => {
  const accountId = '724899'
  const licenseKey = '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'
  // const url = `https://724899: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@download.maxmind.com/geoip/databases/GeoIP2-City/download?suffix=tar.gz`
  const url = `https://${accountId}:${licenseKey}@download.maxmind.com/geoip/databases/GeoIP2-City/download?suffix=tar.gz`
  const filePath = 'src/ip/data/maxmind/maxmind.mmdb.gz'

  console.log('正在下載 maxmind 數據庫...')

  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.get(url, resolve)
      req.on('error', reject)
    })

    if (response.statusCode !== 302) {
      console.error('無法下載 maxmind 數據庫.')
      return
    }

    // 重新定向
    const response2 = await new Promise((resolve, reject) => {
      const req = https.get(response.headers.location, resolve)
      req.on('error', reject)
    })

    const fileStream = fs.createWriteStream(filePath)
    response2.pipe(fileStream)

    await new Promise((resolve, reject) => {
      fileStream.on('close', resolve)
      fileStream.on('error', reject)
    })

    console.log('下載成功.')
    return
  } catch (err) {
    console.error('下載時出錯:', err)
  }
}

const extractMaxmindDB = async () => {
  const filePath = 'src/ip/data/maxmind/maxmind.mmdb.gz'
  const extractedFilePath = 'src/ip/data/maxmind/maxmind.mmdb'

  console.log('正在解壓縮 maxmind 數據庫...')

  try {
    const input = fs.createReadStream(filePath)
    const output = fs.createWriteStream(extractedFilePath)

    const gunzip = zlib.createGunzip()
    input.pipe(gunzip).pipe(output)

    await new Promise((resolve, reject) => {
      output.on('finish', resolve)
      output.on('error', reject)
    })

    console.log('解壓縮成功.')
    fs.unlinkSync(filePath)
    console.log('已刪除壓縮文件.')
  } catch (err) {
    console.error('解壓縮時出錯:', err)
  }
}

const run = async () => {
  await downloadMaxmindDB()
  await extractMaxmindDB()
  compressMaxmindDB()
}

run()
