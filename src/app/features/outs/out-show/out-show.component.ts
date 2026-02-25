import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutService } from '../../../services/out.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-out-show',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './out-show.component.html',
  styleUrls: ['./out-show.component.css']
})
export class OutShowComponent implements OnInit {

  out: any;
  

  constructor(
    private outService: OutService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadOut(id);
  }

  loadOut(outId: number) {
    this.outService.getOutById(outId).subscribe({
      next: (outRes: any) => {
        this.out = {
          ...outRes,
          code_product: outRes.product?.code || 'N/A',
          productName: outRes.product?.name || 'N/A',
          locationName: outRes.product?.location?.name || 'N/A',
          locationDescription: outRes.product?.location?.description || ''
        };
        console.log('✅ Entrada cargada:', this.out);
      },
      error: err => console.error('❌ Error cargando entrada:', err)
    });
  }

  onCancel() {
    this.router.navigate(['/outs/list']);
  }

  onEdit() {
    if (this.out?.id) {
      this.router.navigate([`/out/edit/${this.out.id}`]);
    }
  }
}
