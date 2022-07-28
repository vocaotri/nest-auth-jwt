const formatLink = (link: string) => {
    return link.replace(/\\/g, '/').replace('public\\','').replace('public/','');
}
export { formatLink };