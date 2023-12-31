// utils.ts
export function formatPicture(picture) {
  if (picture.__typename === 'MediaSet') {
    if (picture.original.url.startsWith('ipfs://')) {
      let result = picture.original.url.substring(7, picture.original.url.length)
      return `http://lens.infura-ipfs.io/ipfs/${result}`
    } else if (picture.original.url.startsWith('ar://')) {
      let result = picture.original.url.substring(4, picture.original.url.length)
      return `http://arweave.net/${result}`
    } else {
      return picture.original.url
    }
  } else {
    return picture
  }
}

export function getGateway(hashoruri) {
  if (hashoruri.includes('https')) {
    return hashoruri
  }
  if (hashoruri.includes('ipfs://')) {
    console.log("ipfs: ", hashoruri.replace('ipfs://', 'https://ipfs.io/ipfs/'))
    return hashoruri.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }
  if (hashoruri.includes('ar://')) {
    console.log('ar: ', hashoruri.replace('ar://', 'https://arweave.net/'))
    return hashoruri.replace('ar://', 'https://arweave.net/')
  }
} 