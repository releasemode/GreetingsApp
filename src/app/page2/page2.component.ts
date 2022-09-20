import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.scss']
})
export class Page2Component implements OnInit {
  textAdded=false;
  user = new FormControl()
  imageSrc: any = null
  isimageLoaded = false
  isAdmin = false;
  imagePath = this.adminService.imageBasePath;
  obj: any = {
    image: {
      url: 'https://i.imgur.com/378avC9.png',
      path: '//fvhgfdvhgvfhg'
    },
    color: '#0000ff',
    font: 'roboto',
    size: 100,
    text: {
      coordinates: {
        x: 0,
        y: 0
      }
    }
  }
  cardData: any;
  constructor(
    public adminService: AdminService,
     public route: ActivatedRoute, 
     ) { }

  async ngOnInit() {
    let params: any = this.route.snapshot.queryParams
    if (params.isAdmin) {
      this.isAdmin = params.isAdmin
    }
    this.cardData = await this.getCardDataById(params.id);
    this.obj = {
      id:  this.cardData[0].id,
      image: {
        url: this.imagePath +  this.cardData[0].image,
      },
      color:  this.cardData[0].fontColor,
      font:  this.cardData[0].fontFamily,
      size:  this.cardData[0].fontSize,
      text: {
        coordinates: {
          x: ( this.cardData[0].xAxis) ?  this.cardData[0].xAxis : 0,
          y: ( this.cardData[0].yAxis) ?  this.cardData[0].yAxis : 0,
        }
      }
    }
    if (this.isAdmin && this.obj?.text?.text) {
      this.user.setValue(this.obj.text.text)
    }
    this.drag();
    this.textAdded=false;
  }


  async drag() {

    this.textAdded=true
    let imageObj: any = new Image();

    imageObj.src = await this.getBase64ImageFromUrl(this.obj.image.url);

    imageObj.onload = function () {

      var imageUrl: any = document.getElementById("imageUrl")
      var color: any = document.getElementById("color")
      var font: any = document.getElementById("font")
      var size: any = document.getElementById("size")

      const data_obj: any = {
        imageUrl: imageUrl.value,
        color: color.value,
        font: font.value,
        size: size.value,
      }
      document.getElementById("loaded")?.click()
      const canvas: any = document.getElementById('canvas')
      canvas.width = imageObj.width;
      canvas.height = imageObj.height;
      const ctx = canvas.getContext("2d");
      // canvas.width = window.innerWidth;
      // canvas.height = window.innerHeight;
      let selectedText: any;
      requestAnimationFrame(renderLoop);
      const mouse = {
        x: 0,
        y: 0,
        bounds: canvas.getBoundingClientRect(),
        button: false,
        dragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        events(event: any) {  // mouse event handler should only record current mouse state
          const m = mouse;
          if (event.type === "mousedown" || event.type === "touchstart") { m.button = true }
          else if (event.type === "mouseup" || event.type === "touchend") { m.button = false }
          m.x = event.pageX - m.bounds.left - 0;
          m.y = event.pageY - m.bounds.top - 0;
        }
      };
      document.addEventListener("mousemove", mouse.events);
      document.addEventListener("mousedown", mouse.events);
      document.addEventListener("mouseup", mouse.events);
      // document.addEventListener("click", mouse.events);
      document.addEventListener("touchend", mouse.events);
      document.addEventListener("touchstart", mouse.events);
      document.addEventListener("touchmove", mouse.events);
      function renderLoop(time: any) {
        if (!textItems.length) { addDemoText() }
        // textItems[0].update("Frame time: " + time.toFixed(3) + "ms");
        let cursor = "default";
        let isAdminInput: any = document.getElementById("isAdmin")
        if (isAdminInput?.value == 'true') {
          handleMouse();
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (selectedText) {
          cursor = mouse.dragging ? "none" : "move";
          ctx.fillStyle = "#08F"; // highlight selected text
          selectedText.draw();
        }

        canvas.style.cursor = cursor;
        ctx.drawImage(imageObj, 0, 0);

        // ctx.drawImage(imageObj, 0, 0);

        // ctx.moveTo(0, 0);
        // ctx.lineTo(200, 100);
        // ctx.stroke();


        textItems.draw(ctx);
        requestAnimationFrame(renderLoop);
      }




      function handleMouse() {
        const m = mouse;
        const text = selectedText;
        if (m.button) {
          if (!m.dragging && text !== undefined) {
            m.dragging = true;
            m.dragOffsetX = text.x - m.x;
            m.dragOffsetY = text.y - m.y;
          }
          if (m.dragging) {
            text.x = m.x + m.dragOffsetX;
            text.y = m.y + m.dragOffsetY;
            text.keepOnCanvas()
          }
        } else {
          if (m.dragging) {
            selectedText = undefined;
            m.dragging = false;
          }
          selectedText = textItems.getUnder(m);
        }
      }

      const textItems: any = Object.assign([], {
        getUnder(point: any): any { // returns undefined if no text under
          for (const t of textItems) {
            if (point.x >= t.x && point.x <= t.x + t.width && point.y < t.y + t.size && point.y >= t.y) {
              return t;
            }
          }
        },
        add(ctx: any, text: any, x: any, y: any, color = data_obj.color, size = data_obj.size, font = data_obj.font) { // context ctx to measure the text
          let item;
          ctx.font = size + "px " + font;
          const width = ctx.measureText(text).width;
          textItems.push(item = {
            text, x, y, color, font, size, width,
            draw() {
              ctx.font = this.size + "px " + this.font;
              ctx.textBaseline = "hanging";
              ctx.fillText(this.text, this.x, this.y);
            },
            keepOnCanvas() {
              const maxX = ctx.canvas.width - this.width;
              const maxY = ctx.canvas.height - this.size;
              this.x < 0 && (this.x = 0);
              this.y < 0 && (this.y = 0);
              this.x >= maxX && (this.x = maxX - 1);
              this.y >= maxY && (this.y = maxY - 1);
              let newx: any = document.getElementById("newx")
              newx.value = this.x
              let newy: any = document.getElementById("newy")
              newy.value = this.y
            },
            update(text: any) {
              this.text = text;
              ctx.font = this.size + "px " + this.font;
              this.width = ctx.measureText(text).width;
              this.keepOnCanvas();
            }
          });
          return item;
        },
        draw(ctx: any) {
          for (const text of textItems) {
            ctx.fillStyle = text.color;
            text.draw();
          }
        }
      });
      function addDemoText() {
        let idx = 0;
        textItems.add(ctx, "", 0, 0);
        let inp: any = document.getElementById('txt')
        for (const t of inp.value.split('\n')) {
          let xElement: any = document.getElementById('x')
          let yElement: any = document.getElementById('y')
          const text = textItems.add(ctx, t, xElement.value, yElement.value);
          text.keepOnCanvas();
          idx += text.width + 12
        }
      }


    }

    // ctx.drawImage(imageObj, 0, 0);
    // ctx.moveTo(0, 0);
    // ctx.lineTo(200, 100);
    // ctx.stroke();

  }


  downloadImage() {
    let ele: any = document.getElementById('canvas')
    var img = ele.toDataURL("image/jpg");
    let generatedImage = img.replace('image/jpg', 'image/octet-stream');
    let a = document.createElement('a');
    a.href = generatedImage;
    a.download = `a.jpg`;
    a.click();
    // let ele: any = document.getElementById('canvas')
    // html2canvas(ele).then((canvas) => {
    //   let generatedImage = canvas
    //     .toDataURL('image/jpg')
    //     .replace('image/jpg', 'image/octet-stream');
    //   let a = document.createElement('a');
    //   a.href = generatedImage;
    //   a.download = `a.jpg`;
    //   a.click();
    // });
  }



  async getBase64ImageFromUrl(url: any) {
    let imageUrl: any = url

    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  imageLoaded() {
    this.isimageLoaded = true
  }


  async saveposition() {
    let x: any = document.getElementById("newx")
    let y: any = document.getElementById("newy")

    let body = {
      id: this.cardData[0].id,
      code: this.cardData[0].code,
      fontColor: this.cardData[0].fontColor,
      fontSize: this.cardData[0].fontSize,
      fontFamily: this.cardData[0].fontFamily,
      xAxis: x.value,
      yAxis: y.value,
      image: this.cardData[0].image,
    }
    this.adminService.updateProductById(body).subscribe((res:any)=>{
      console.log(res)
    })

  }

  setCoordinates() { }

  getCardDataById(id: number) {
    return new Promise((resolve, reject) => {
      this.adminService.getProductById(id).subscribe({
        next: (response: any) => {
          resolve(response)
        },
        error: (err: any) => {
          reject(err);
          this.adminService.handlerMessage(err.code)
        }
      })
    })
  }

}

