import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {

  categories:any[] = [];

  newCategory = {
    name:'',
    description:''
  };

  apiUrl = 'http://localhost:4040/api/parameters/categories';

  constructor(private http:HttpClient){}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(){

    this.http.get<any>(this.apiUrl)
    .subscribe(res=>{
      this.categories = res.categories ?? res;
    });

  }

  createCategory(){

    if(!this.newCategory.name){
      alert("Ingrese el nombre de la categoría");
      return;
    }

    this.http.post(this.apiUrl,this.newCategory)
    .subscribe(()=>{

      alert("Categoría creada");

      this.newCategory = {
        name:'',
        description:''
      };

      this.loadCategories();

    });

  }

  deleteCategory(id:number){

    if(!confirm("Eliminar categoría?")) return;

    this.http.delete(`${this.apiUrl}/${id}`)
    .subscribe(()=>{

      this.loadCategories();

    });

  }

}