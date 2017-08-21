/// <reference path="../typings/index.d.ts" />

namespace Game {

    function $(query: string, element?: NodeSelector): Element {
        return (element || document).querySelector(query);
    }

    function on(element: any, event: string, callback: EventListenerOrEventListenerObject) {
        element.addEventListener(event, callback, false);
    }

    let canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        scene: Scene;

    function resize(): void {
        let body = document.body,
            portrait = body.clientWidth / body.clientHeight < canvas.width / canvas.height;
        canvas.style.width = portrait ? '100%' : '';
        canvas.style.height = portrait ? '' : '100%';
    }
    
    function bind(): void {
        const hero = scene.hero;
        on(document, 'keydown', (e: KeyboardEvent) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119) {
                hero.speed.y = -1;
            } else if (key == 37 || key == 65 || key == 97) {
                hero.speed.x = -1;
                hero.face = 0;
            } else if (key == 39 || key == 68 || key == 100) {
                hero.speed.x = 1;
                hero.face = 1;
            }
        });
        on(document, 'keyup', (e: KeyboardEvent) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119 || key == 40 || key == 83 || key == 115) {
                hero.speed.y = 1;
            } else if (key == 37 || key == 65 || key == 97 || key == 39 || key == 68 || key == 100) {
                hero.speed.x = 0;
            }
        });
        on(window, 'resize', resize);
    }

    function update(): void {
        requestAnimationFrame(() => {
            update();
        });
        if (scene.ready()) {
            scene.update();
            scene.render(ctx);
        }
    }

    on(window, 'load', () => {
        canvas = <HTMLCanvasElement>$('#game');
        ctx = canvas.getContext('2d');
        const src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAADACAYAAADcKuc+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgVEyYXGBaVIQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAKp0lEQVR42u1dbbKzLAyVzt1RWZNdU10TXRPvj7fxSdPwEdC26Dkznd6rBiyHhAQDuimNqBxzUz1Glx8CqR8UY3z//c652kYYXX5oAqNoCWsjjC4/FP60gyGEaVmW9QdrvTmH0eVHwqV0wTzP1GubMLr88AQCAxJI5ifhBKQ8vMPIH8ILzbh3ZkdiQPnhCVTdce4QVDbC6PJDj4Gx03sbXR5ODPCZOLCqmz4eD/N4M4j8+IF8COHl4PV6ffvx3vts4Dyy/OiI9AkhxOfYsYKOyXOs548ufzwi5SeEsP7oTAOMLj+uCRUhReQmSZqjzHgiXfK1HM2k/aD8cTRRQ8o01ZYzoPxwGpibegIGIVALflfTaiA0hhDeHuUYO4RzzsUO+VN0yIth5sIlPln3nhotxsjJrJIXPcsi/0Z8CIGHG+b6tbGlZ3qoRV6TfZmJud1uk3Nu/W4dQ2Vcxsuie/iW1jzvLTZqsKPvFkcohBDJrLiGH8ZN0nMM394BCiGsH9FQb05FTVktcsr1ufsyEdCqPZppsJJA98/L+NuYvJr7ri7Le29Nh1DrydyXCd57R1pEDeq9N2kSaW6LFsq6ttbCOM9z5N98tiRzrqqsVrmGMkza2CPbWgaXszzQRU7oD8LVmiHkhI5BYEzkUdb25NHlh44D1V4bQpjmeZ7meW4KnEeWH5pA+vGpDK/axhtV/hAaCAw2lSbHDGPvHV1+eCcmspxJi9d6FPkh8ad5b8oTAFP+5YDyxx0DrZPPR5OHEwN8xIRWOwkd48ro8uMQSDEUJQPRmCKfgaVyLUeXHxEvz894LiU9f5LnJvG0YXD5YxEosrZSnyPJH4PAVGZzxZNsVd7wBPzb8sfQvhSJhXSGovxkyN/8gvwxvVAlEQn4VQ0sjBGl3qzKJxyH6votSUw5+TNooDU3cnLORSbnUlNa5M4XkJSvxIs81ceTipV7Ts/DTf/SBy1jUE+6YE8ZVTMxPFf0drtVzUfKe2jJx7S2Y2v22ePxeMn5NPcg1vAtiUo8XdF9KX08Z7IsOZlv5Ri8SK2ealPamjDLr+/NF2X3/t250NwEskUTY4yT975JezVt1O6LGoy0x5rn6b1fs6Vbs7Wpfu+9s9a/qSOk5F+WzlWVU5Ap3UOxnG/mePbeg3WjH/fBDvHN+oeB0xou5QywyV+3IwGxUD9ILLngFXY/1ZC9HaB4DyBRJzC5Lj41MCsN2dsB1HvQ6geJmam0XMPVmL2aDQWeK4+SgXXjPZxWA98av7bhyCR2yjfdA7QwEQf29vottAaa10ggyDuABgInIbA3bb1H/gwp89DAM8eBDbGcSX5ZFtIicxyZkEUc2GnCnPc+0iLK1GJKkgMB22vgNP0/W59dyVpBQKwhMENe9h6gfXkCtyDgpZyK+pIkZuoHeRUNisdJAAAAm5iyOLD8qQP5GGPs2Z7x2/KnJjDGGNeJ5YZGXOWv12uzPAEk2rzQl8bnTwcqn8G9kM9hkZ+m5IJMeKK5ODDV+JWNmCTfIq+RBxLLBBYbv9CIRfJr5HPkgcQ0gdWNn2jEb8sjVODrCax/W6/N/d9Q9+k1sGlVD5tYnr4s785O4OqiU0Muy7JOaNPf/BGSMqm9ToJLOa2MlDxtD5kqI1M/nBjekI3hxy/IAwAAAEBTIM8905SjI67JncNY9akwgjxI6flxj08e416ldo7JgsQd8adlkmk5KfJY7nqtAwA7aSCtzZbzn6n/5Xfp+m8t2j8NaDvGPb73escdwDQw7rwRmsOLeHfFRT4BKP0vj+Wux1KxD4URe2khtO+zcaAGSzwXjWV/orzDx6NbZaVFess0e9t0VzrhBuWdIqutuD5Q7jqRaijlYGvDbV3esQP50gUbOCLRYMJW8uS2lvM8F/f9PKUXuoEGcqfl5W9q9ErNSZI3Tf/P6DweD5NJp/s/shm91JixTzbA7Xab7vf72/H7/d40LXf0UMbVEMi0y/TSZJoTvd/vpbeIxRjji+ZJEvm5eZ6r80uJxKNmsV227MVbhX0pDWzBGTVQ1ahML16v5xuNcw3k45ilTu0e2CQ5NHBrDdz7/RKljPEzauCltuE+YUIzO+JLTTKRfiYCk+bzF9zxFjLONqEeU8i8NiApM6VT76vrlfcg3kxW9TuO/AKsy569X5nP/MQY+GZFjhzMXz5limrktx4DH4/H+jnDGJh15UkDW3vyFs6EtQxaAHNkR8akgdaG4O9aqtGCUrD+eDyaTPFZNHDzGMygPcWH94Yg/lShxKU0JvFxqacherXA2oHOkptzyZFH6/1KZjClPTHG1SxWkJ/VQtLAWu1LrCc8nwnlDZ8iYZ7nqcYEts7mEHmJOnp3gjomgfT8jT+f23EMfNFaThQnL7UN5fOtZCa0yAyngff7/cUzzJEQQnjTEKsXKstyzk3e+yx5ZAGs2p4r75Be6Kc0kM+c8E/95E9Ux7xlWQ45G3PZi4Re8nldcskb8A9/e5LAg+6eOFLukgEMEgdSfVYNrFnfiDhwxzFQkm7VwOv1+rYA9aizMZvEgbmYrof8Vg0kWfKie6cBEQd+WAN5B6LQ5pQaaIkDf2kMJPIoBHHOHVYDf9oL7dVAIr/XCz4MgT2NUJMKQZrD1zU8Ho9VA9nT+OICFz4lZ92LFDMx9jFwXQ/Ip+S4BnrvJ35NzYwKz8U55RjYGwdu6YW2Oi/a/4gD+zUwSu2TQTd3PJZlmbRrNC0kE8yvp/+tScGnjwNT5ldbM0idhDeyrE+7RjPDFSb1MBPam3ihlP0lGy/nhYYQJu993GLMpfHR4h0fxaRu8jSiJnG3ZwysDVdorNPiPnlu74U4P6GB0nnoHQP3XFlEYx+FHd77KYSwPs3Xzh2aQC1HM0cCN0m8d/Pj1kbT6sPuT7oJXV+8QQ3OYzF+TFtnQD08hPCS4CSPW71AkFVH4NuODnI2JHVsb2/u6Gv7NndiShvbfVoztHpAaoZArXFqjnHNpOBfamzpFec05vJxUtajXSPH2VocJaj/+wENdM65yL1E8n7ldJhyjUvM7lTVCw3cF058mrTsDDtexhBCnOd5/bYcm9jSafrm12vHxYdrUHHpdOaatXxWT825obFp99T2yLZseq6luy/Lgo3tPoHc5ue15NG1tKEC03SgVgN5g9dqTwghauNi5j24TpL3DPRdCCHSdyJFHhqZ8kIlEdSYFvLkOyW0902kyuXHM4lMEURmTGBqf5jUeyDouGY+S3u+SNMpzSmvU5pXmNYKAlPHcnKc0BoSiQherjwGEivjQDl+pWJASSKZS242c+fl39x00njIj/FvvA0mQaD33rXOsBBh9C2J0t63xBKW3HPtXpSOTm9YcioCyRmx7mykES/zaCSJKQ+VE8a90ZSjAygm9Hq9mqbKOPGaedTI4ySTyZQhAw8pSqSCwIRZTE1kSw1ImUfNvGoke++dJFFqo/z7OaF9ek38K41tkkTNfEkzWbst15O4qJjFSDEg1zpoX2MoUZJJvTuw5r2CWhjBTOtbHIrwwTCVVuv1ybeA5hyV1FTasixOaluKKJjOnbS3Z0I7pW3QOKMG9pJYo3E5EqFxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwJHwH5/f84QkVPKaAAAAAElFTkSuQmCC';
        const sprite = new Sprite(src, canvas.width, () => {
            scene = new Scene((<HTMLCanvasElement>$('#test')).getContext('2d'), sprite);
            resize();
            bind();
            update();
        });
    });
}