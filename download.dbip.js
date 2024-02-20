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

const compressDbIpDB = () => {
  console.log('正在壓縮 dbip.mmdb...')

  try {
    runCommand('zip src/ip/data/dbip/dbip.zip src/ip/data/dbip/dbip.mmdb')

    console.log('壓縮完成.')
  } catch (error) {
    console.error('壓縮時發生錯誤:', error)
    process.exit(1)
  }
  process.exit(0)
}

const downloadDbIpDB = async () => {
  const url = 'https://download.db-ip.com/key/14c28da3ed5fccd1e11c6b5937b16cd6ecd32b36.mmdb'
  const filePath = 'src/ip/data/dbip/dbip.mmdb.gz'

  console.log('正在下載 dbIP 數據庫...')

  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.get(url, resolve)
      req.on('error', reject)
    })

    if (response.statusCode !== 200) {
      console.error('無法下載 dbIP 數據庫.')
      return
    }

    const fileStream = fs.createWriteStream(filePath)
    response.pipe(fileStream)

    await new Promise((resolve, reject) => {
      fileStream.on('close', resolve)
      fileStream.on('error', reject)
    })

    console.log('下載成功.')
  } catch (err) {
    console.error('下載時出錯:', err)
  }
}

const extractDbIpDB = async () => {
  const filePath = 'src/ip/data/dbip/dbip.mmdb.gz'
  const extractedFilePath = 'src/ip/data/dbip/dbip.mmdb'

  console.log('正在解壓縮 dbIP 數據庫...')

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
  await downloadDbIpDB()
  await extractDbIpDB()
  compressDbIpDB()
}

run()
