import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { catchError, map } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  url = 'https://http-angular-69faa-default-rtdb.firebaseio.com';
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    return this.http.post(`${this.url}/posts.json`, postData).subscribe(
      (responseData) => console.log(responseData),
      (error) => this.error.next(error.message)
    );
  }

  fetchPost() {
    return this.http
      .get<{ [key: string]: Post }>(`${this.url}/posts.json`)
      .pipe(
        map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        catchError((errorResp) => {
          return throwError(errorResp)
        })
      );
  }

  deletePosts() {
    return this.http.delete(`${this.url}/posts.json`);
  }
}
