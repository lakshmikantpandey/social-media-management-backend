const ConvertToSlug = (title: string) => {
    return title.toLowerCase().replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+/g,'');;
}

export default ConvertToSlug;