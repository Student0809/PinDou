// 解析批量输入字符串
// 支持格式: "A1 1000" 或 "A1 1000, B2 500" 或每行一个
export function parseBatchInput(text) {
  const result = []
  // 支持逗号、换行、空格分隔
  const lines = text.split(/[,\n]/).map(s => s.trim()).filter(Boolean)

  for (const line of lines) {
    // 匹配格式: 色号 + 数字
    const match = line.match(/^([A-Za-z]+\d+)\s+(\d+)/)
    if (match) {
      result.push({
        colorCode: match[1].toUpperCase(),
        quantity: parseInt(match[2], 10)
      })
    }
  }

  return result
}

// 格式化批量输出
export function formatBatchOutput(items) {
  return items.map(item => `${item.colorCode} ${item.quantity}`).join(', ')
}

// 验证色号是否有效
export function isValidColorCode(code, validCodes) {
  return validCodes.includes(code.toUpperCase())
}
