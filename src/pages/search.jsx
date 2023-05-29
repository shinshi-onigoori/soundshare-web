import { useState, useEffect, useContext } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { Dialog, DialogActions, DialogTitle, DialogContent, Box, Button, Fab, IconButton, TextField, Autocomplete, createFilterOptions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ContentCardLine } from '../components/contentCard';
import { API_HOST } from "../util/common";
import { sliceArray } from "../util/commonFunction";
import { useRouter } from "next/router";
import { UserContext } from '../context/sessionContext';

const filter = createFilterOptions();

export default function SearchContentsForm(props) {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const [allowRendor, setAllowRendor] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  useEffect(() => {
    // ここに全ページ共通で行う処理
    const idIsNull = userContext.userId == null;
    const passwordIsNull = userContext.userPassword == null;
    if (idIsNull && passwordIsNull) {
      router.push("/");
      setAllowRendor(false);
    } else {
      setAllowRendor(true);
    };
  }, [router]);
  const [tags, setTags] = useState([]);
  const [createTags, setCreateTags] = useState([]);
  const [contentElements, setContentElements] = useState([]);

  function openModal() {
    setModalOpen(true)
  }
  function modalClosed() {
    setModalOpen(false)
  }

  async function createNewContent(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const postLocation = data.get('location');
    const postBody = {
      tag: createTags,
      description: data.get('description'),
      location: data.get('location'),
      id: postLocation.split('watch?v=')[1]
    };
    const response = await fetch(`${API_HOST}/contents`, {
      method: 'POST',
      body: JSON.stringify(postBody),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((respons) => respons);
    console.log(await response.json())
    modalClosed()
  }

  function generateContentCards(contents) {
    // contentCardコンポーネントを複数行生成してstateにセット
    console.log('generate start')
    let contentCards = []
    for (let i in contents) {
      contentCards.push((
        <ContentCardLine key={i.toString()} contentInfo={contents[i]} />
      ));
    }
    setContentElements(contentCards);
  }

  async function searchByTags() {
    // フォームに入力してあるtagを使用して動画情報を検索
    if (tags.length > 0) {
      const response = await fetch(`${API_HOST}/contents`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Content-Tags': tags
        }),
      }).then((respons) => respons);
      if (response.status == 200) {
        const resBody = await response.json();
        console.log(resBody);
        const sliced_contens = sliceArray(resBody, 5);
        console.log(sliced_contens)
        generateContentCards(sliced_contens);
      }
    } else {
      setContents([])
      setContentElements([])
    }
  };
  if (allowRendor) {
    return (
      <div>
        <div className="searchBox">
          <form className='searchArea' noValidate autoComplete="off">
            <div className="tagForm" >
              <Autocomplete
                id="tags"
                size="small"
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
                    label="SEARCH TAG"
                    variant="standard"
                    color="primary"
                  />
                )}
              />
            </div>
            <div className="searchButton">
              <IconButton aria-label="search" color="primary" onClick={searchByTags}>
                <SearchIcon />
              </IconButton>
            </div>
          </form>
        </div>
        <div className="searchResults">
          {contentElements}
        </div>
        <div className="createButtonArea">
          <Fab color="primary" aria-label="add" onClick={openModal}>
            <AddIcon />
          </Fab>
        </div>
        <Dialog
          open={modalOpen}
          onClose={modalClosed}
        >
          <DialogTitle>Create New Content</DialogTitle>
          <DialogContent>
            <Box component='form' noValidate onSubmit={createNewContent}>
              <TextField id="standard-basic" label="Content Location" name="location" variant="standard" fullWidth />
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
                onChange={(e, v) => setCreateTags(v.map(tag => tag.title ? tag.title : tag))}
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
                variant="filled"
              // onChange={(e, v) => setDescription(v)}
              />
              <Button variant="outlined" type='submit'>CREATE</Button>
            </ Box>
          </DialogContent>
          <DialogActions>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
};