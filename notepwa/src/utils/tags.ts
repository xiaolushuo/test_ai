const zhStopwords = new Set([
  '的','了','在','是','我','有','和','就','不','人','都','一','一个','上','也','很','到','说','要','看','好','没','你','他','她','它','我们','你们','他们','这','那','与','及','或','并','被','为','于','对','以','把','而','其','并且','但是','因为','所以','如果','然后','而且','以及','还是','还有','以及','这个','那个','以及','还有'
])

const enStopwords = new Set([
  'the','and','for','are','with','this','that','have','has','you','your','from','was','were','will','would','can','could','should','a','an','to','in','on','at','by','of','or','as','it','is','be','not','we','they','he','she','them','our'
])

export function generateTags(input: string, maxTags = 5): string[] {
  if (!input) return []
  const text = input.trim()
  const cn = text.match(/[\u4e00-\u9fa5]{2,}/g) || []
  const en = (text.toLowerCase().match(/[a-z0-9]{3,}/g) || [])

  const counts = new Map<string, number>()

  for (const w of cn) {
    if (zhStopwords.has(w)) continue
    counts.set(w, (counts.get(w) || 0) + 1)
  }
  for (const w of en) {
    if (enStopwords.has(w)) continue
    counts.set(w, (counts.get(w) || 0) + 1)
  }

  const sorted = Array.from(counts.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]
      return b[0].length - a[0].length
    })
    .map(([w]) => w)

  return sorted.slice(0, maxTags)
}