export const FIXED_AI_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/responses'
export const FIXED_AI_MODEL = 'doubao-seed-2-0-lite-260215'

// 调用AI API识别图片
export async function recognizeImage(imageBase64, config) {
  const apiUrl = FIXED_AI_API_URL
  const apiKey = config?.apiKey
  const modelName = FIXED_AI_MODEL

  if (!apiKey) {
    throw new Error('请先在设置中填写 API Key')
  }

  const prompt = `请识别图片中的拼豆色号及对应数量。
严格按“色号 数量”格式输出，多个结果按换行分隔。
示例：
A1 100
B2 50
C3 30
只输出色号和数量，不添加解释或其他文字。`

  try {
    const requestBody = {
      model: modelName,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_image',
              image_url: imageBase64
            },
            {
              type: 'input_text',
              text: prompt
            }
          ]
        }
      ]
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      let message = 'API调用失败'
      try {
        const error = await response.json()
        message = error.error?.message || error.message || message
      } catch {
        // ignore JSON parse error
      }
      throw new Error(message)
    }

    const data = await response.json()

    if (typeof data.output_text === 'string' && data.output_text.trim()) {
      return data.output_text.trim()
    }

    // responses 接口：优先取 output 中 type=message 的 output_text
    if (Array.isArray(data.output)) {
      const messageChunks = []
      const fallbackChunks = []

      for (const item of data.output) {
        const targetChunks = item?.type === 'message' ? messageChunks : fallbackChunks

        if (Array.isArray(item?.content)) {
          for (const contentItem of item.content) {
            if (contentItem?.type === 'output_text' && typeof contentItem?.text === 'string') {
              targetChunks.push(contentItem.text)
              continue
            }
            if (typeof contentItem?.output_text === 'string') {
              targetChunks.push(contentItem.output_text)
              continue
            }
            if (typeof contentItem?.text === 'string') {
              targetChunks.push(contentItem.text)
            }
          }
        }

        if (Array.isArray(item?.summary)) {
          for (const summaryItem of item.summary) {
            if (typeof summaryItem?.text === 'string') {
              fallbackChunks.push(summaryItem.text)
            }
          }
        }
      }

      const outputText = (messageChunks.length ? messageChunks : fallbackChunks).join('\n').trim()
      if (outputText) {
        return outputText
      }
    }

    return ''
  } catch (error) {
    console.error('AI识别失败:', error)
    throw error
  }
}

// 将文件转换为base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 裁剪图片并返回base64
export function cropImageToBase64(imageElement, cropper) {
  const canvas = cropper.getCroppedCanvas({
    fillColor: '#fff',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high'
  })

  return canvas.toDataURL('image/jpeg', 0.98)
}
