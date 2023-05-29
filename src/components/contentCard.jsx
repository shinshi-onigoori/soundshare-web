import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { createFilterOptions, Autocomplete, Button, TextField, CardActionArea, Dialog, DialogActions, DialogTitle, DialogContent, Box } from '@mui/material';
import { useState } from 'react';
import { useRouter } from "next/router";

import { API_HOST } from '../util/common';

const filter = createFilterOptions();

export function ContentCard(props) {
  const content = props.content;
  const [modalOpen, setModalOpen] = useState(false)
  const [tags, setTags] = useState(content.tag);
  const [description, setDescription] = useState(content.description);
  const videoId = content.documentId
  const imageLink = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  const router = useRouter()

  function openModal() {
    setModalOpen(true)
  }
  function modalClosed() {
    setModalOpen(false)
  }

  async function deleteContent() {
    const response = await fetch(`${API_HOST}/contents/${videoId}`, {
      method: 'DELETE',
      body: JSON.stringify({}),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((respons) => respons);
    if (response.status == 200) {
      const res_body = await response.json()
      console.log(res_body)
    } else if (response.status == 404) {
      const res_body = await response.json()
      console.log(res_body)
      router.push('/notFound')
    }
  }

  async function updateContentInfo(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const post_description = data.get('description');
    const postBody = {
      id: content.documentId,
      tag: tags,
      description: post_description
    };
    console.log(postBody)
    const response = await fetch(API_HOST + '/contents', {
      method: 'PATCH',
      body: JSON.stringify(postBody),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((respons) => respons);
    if (response.status == 200) {
      const res_body = await response.json()
      setDescription(post_description)
      modalClosed()
      console.log(res_body)
    } else if (response.status == 404) {
      const res_body = await response.json()
      console.log(res_body)
      router.push('/notFound')
    }
  }

  return (
    <div>
      <Card sx={{ maxWidth: 345, maxHeight: 500 }}>
        <CardHeader
          action={
            <IconButton aria-label="settings" onClick={openModal}>
              <MoreVertIcon />
            </IconButton>
          }
          title={content.title}
          sx={{ height: 200 }}
        />
        <Dialog
          open={modalOpen}
          onClose={modalClosed}
        >
          <DialogTitle>{content.title}</DialogTitle>
          <DialogContent>
            <Box component='form' noValidate onSubmit={updateContentInfo}>
              <Autocomplete
                id="tags"
                size="small"
                name="tags"
                defaultValue={tags}
                options={[]}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === 'string') {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.title;
                }}
                multiple // 複数可
                freeSolo // 自由入力可
                clearOnBlur // 新規選択肢を追加可
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  // Suggest the creation of a new value
                  if (params.inputValue !== '') {
                    filtered.push({
                      inputValue: params.inputValue,
                      title: params.inputValue,
                    });
                  }
                  return filtered;
                }}
                onChange={(e, v) => setTags(v.map(tag => tag.title ? tag.title : tag))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Content Tag"
                    variant="standard"
                    color="primary"
                    id='innerTag'
                    name='innerTag'
                  />
                )}
              />
              <TextField
                id="description"
                name='description'
                label="Content Description"
                multiline
                fullWidth
                rows={4}
                defaultValue={content.description}
                variant="filled"
              // onChange={(e, v) => setDescription(v)}
              />
              <Button onClick={deleteContent} variant="contained" color="error">DELETE</Button>
              <Button variant="outlined" type='submit'>UPDATE</Button>
            </ Box>
          </DialogContent>
          <DialogActions>
          </DialogActions>
        </Dialog>
        <CardActionArea href={content.location} sx={{ height: 500 }}>
          <CardMedia
            component="img"
            height="200"
            image={imageLink}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ height: 250 }}>
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

export function ContentCardLine(props) {
  const contentInfo = props.contentInfo;
  console.log(props.contentInfo)
  const contentCards = contentInfo.map((content) => {
    return (
      <div className="singleCard" key={content.documentId}>
        <ContentCard key={content.documentId} content={content} />
      </div>
    );
  })
  return (
    <div className="cardLine">
      {contentCards}
    </div>
  )
}
