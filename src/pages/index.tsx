import PostList from 'src/components/PostList'
import TagList from 'src/components/TagList'
import Tag from '@interfaces/Tag'
import api from '@utils/api'
import { useEffect, useState } from 'react'

export default function Home() {
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    api.get<Tag[]>('/tags').then((res) => {
      setTags(res.data)
    })
  }, [])

  return (
    <div className="flex justify-between">
      <TagList tags={tags} key={''} />
      <PostList />
    </div>
  )
}
