import {
  Button,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Posts = ({ posts }) => {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const columns = [
    { id: '0', label: 'author' },
    { id: 1, label: 'title' },
    { id: 2, label: 'link' },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (router.query?.gid == null || posts == null || posts.length === 0) {
    return (
      <>
        <div>No posts found for this game</div>
        <Link href="/">Return to homepage?</Link>
      </>
    );
  }
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <h1 style={{ padding: '0.5em' }}>Posts</h1>
      <div style={{ display: 'flex', gap: '1em', marginLeft: '0.5em' }}>
        <Button variant="contained" onClick={() => router.back()}>
          Go back
        </Button>
        <Button
          variant="contained"
          onClick={() => router.push(`/posts/add?gid=${posts[0].gameTopic}`)}
        >
          Add a Post
        </Button>
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} align="left" style={{ minWidth: 170 }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {posts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    <TableCell>{row.author}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>
                      <Link
                        href={`/posts/see?id=${row.id}`}
                        aria-label={`Read the post - ${row.title}`}
                      >
                        Read the post
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={posts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export async function getServerSideProps(context) {
  const id = context.query?.gid ?? '';
  const url = new URL(
    `/posts/byGameTopic/${id}`,
    process.env.NEXT_PUBLIC_MAIN_API_URL
  );
  const res = await fetch(url.toString());
  const posts = await res.json();

  return {
    props: {
      posts,
    },
  };
}

export default Posts;
