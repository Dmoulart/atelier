export default defineComponent({
  props: {
    title: String,
    description: String,
  },
  setup(props) {
    useSeoMeta({
      title: () => props.title,
      ogTitle: () => props.title,
      twitterTitle: () => props.title,
      description: () => props.description,
      ogDescription: () => props.description,
      twitterDescription: () => props.description,
    })
    return () => null
  },
})
