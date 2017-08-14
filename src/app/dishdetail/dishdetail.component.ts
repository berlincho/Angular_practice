import { Component, OnInit} from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import 'rxjs/add/operator/switchMap';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  
  commentInputArray: Comment[] = [];
  commentInput: Comment = {
    rating: 5,
    comment: '',
    author: '',
    date: ''
  };

  formErrors = {
    author: '',
    comment: ''
  };

  validationMessages ={
    author:{
      'required': 'Author is required.',
      'minlength': 'Author must be at least 2 characters long.'
    },
    comment:{
      'required': 'Comment is required.'
    }
  };

  commentForm: FormGroup;
  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
    
  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private cm: FormBuilder,
    private location: Location) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishservice.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds);

    this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id) });
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.cm.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: '',
      comment: ['', Validators.required] 
    });

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    //re(set) form validation messages
    this.onValueChanged();
  }

  onValueChanged(data?: any){
    if(!this.commentForm)
      return;
    const form = this.commentForm;
    for(const field in this.formErrors){
      // clear previous error message (if any)
      this.formErrors[field] = '';
      
      const control = form.get(field);
      if(control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for(const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit(){
    this.onComment();
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: '',
    });
  }

  onComment() {
    let commentTmp: Comment = {
        author: this.commentInput.author,
        rating: this.commentInput.rating,
        comment: this.commentInput.comment,
        date: new Date().toISOString()
    };
    this.commentInputArray.push(commentTmp);
  }

}
