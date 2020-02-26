import * as THREE from 'three'
import * as OrbitControls from 'three-orbitcontrols'
import * as dat from 'dat.gui';
import {TweenMax, TimelineMax, Bounce, Power0} from 'gsap';
import {Square, Piece, countPiece} from './module'
import {map, rayReceiveObjects, turn, pieceInfo, changeTurn, pieceType} from './config';
export function init(){

    //初期セット＝＝＝＝＝＝＝＝＝
    let width = window.innerWidth;
    let height = window.window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mycanvas'),
        shadowMap:{ enabled: true },
        antialias: true,
        // alpha: true
    })
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const group = new THREE.Group();

    const camera = new THREE.PerspectiveCamera(90, width / height, 1, 1000);
    camera.position.set(0,100,100);
    camera.lookAt(0,0,0);

    const controls = new OrbitControls(camera, renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1,1,1);
    light.target.position.set(0,0,0);
    light.castShadow = true;
    scene.add(light);

    const ambi_light = new THREE.AmbientLight(0x404040);
    scene.add(ambi_light);
    //初期セット＝＝＝＝＝＝＝＝＝終了
    
    //マス目ジオメトリ―を配置＝＝＝＝＝＝＝＝＝
    const presetPiece = {
        black:[[3,3], [4,4]],
        white:[[3,4], [4,3]]
    }
    for(let i = 0; i < map.x; i++){
        for(let j = 0; j < map.z; j++){
            
            if(i == presetPiece.black[0][0] && j == presetPiece.black[0][1]){
                let square = new Square(i, j, false);
                group.add(square.set());
                presetPiece.black[0][2] = square.position;
            }else if(i == presetPiece.black[1][0] && j == presetPiece.black[1][1]){
                let square = new Square(i, j, false);
                group.add(square.set());
                presetPiece.black[1][2] = square.position;
            }else if(i == presetPiece.white[0][0] && j == presetPiece.white[0][1]){
                let square = new Square(i, j, false);
                group.add(square.set());
                presetPiece.white[0][2] = square.position;
            }else if(i == presetPiece.white[1][0] && j == presetPiece.white[1][1]){
                let square = new Square(i, j, false);
                group.add(square.set());
                presetPiece.white[1][2] = square.position;
            }else{
                let square = new Square(i, j, true);
                group.add(square.set());
            }
        }
    }
    scene.add(group);
    
    scene.add(new Piece(presetPiece.black[0][2], {xAxis: presetPiece.black[0][0], zAxis: presetPiece.black[0][1]}, pieceType.black).put());
    scene.add(new Piece(presetPiece.black[1][2], {xAxis: presetPiece.black[1][0], zAxis: presetPiece.black[1][1]}, pieceType.black).put());
    scene.add(new Piece(presetPiece.white[0][2], {xAxis: presetPiece.white[0][0], zAxis: presetPiece.white[0][1]}, pieceType.white).put());
    scene.add(new Piece(presetPiece.white[1][2], {xAxis: presetPiece.white[1][0], zAxis: presetPiece.white[1][1]}, pieceType.white).put());

    //マス目ジオメトリ―を配置＝＝＝＝＝＝＝＝＝終了

    //クリック処理＝＝＝＝＝＝＝＝＝
    const canvas = document.getElementById('mycanvas');
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchend', handleClick);

    function handleClick(event){
        // console.log(event);
        if(event.type == "click"){
            mouse.x = (event.clientX / event.target.offsetWidth) * 2 - 1;
            mouse.y = - (event.clientY / event.target.offsetHeight) * 2 + 1;
        }
        else if(event.type == "touchend"){
            mouse.x = (event.changedTouches[0].clientX / event.target.offsetWidth) * 2 - 1;
            mouse.y = - (event.changedTouches[0].clientY / event.target.offsetHeight) * 2 + 1;
        }
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(rayReceiveObjects);
        const mapData = {
            array: scene.children.slice(3, scene.children.length)
        }
        // console.log(intersects[0]);
        if(intersects.length > 0 && intersects[0].object.name.put){
            //パネル色替え
            // intersects[0].object.material.color.r = 1;
            // console.log(intersects[0].object.position);
            
            // console.log('turn', turn);
            if(checkPiece(intersects[0].object, mapData)){
                const piece = new Piece(intersects[0].object.position, intersects[0].object.name, turn);
                scene.add(piece.put());
                intersects[0].object.name.put = false;
                // console.log('SCENE', scene);
                new Promise(function(resolve){
                    resolve(changeTurn());
                })
                // .then(function(){
                //     countPiece(scene.children.slice(3, scene.children.length));
                // }).then(function(){
                //     console.log(display);
                // });
            };
            
        }
    }
    function checkPiece(target, mapData){
        const targetData = {
            x: target.name['xAxis'],
            z: target.name['zAxis']
        }
        
        // console.log('targetData', targetData);
        // console.log('mapData', mapData);
        
        let n = 0;
		let m = 0;
        let flippablePiece = {
            fixed:[],
            temp:[]
        };
        
        for(let dirX = -1; dirX <= 1; dirX++){
            for(let dirZ = -1; dirZ <= 1; dirZ++){
                if(dirX == 0 && dirZ == 0){
                    continue;
                }
                n = 0;
                m = 0;
                let testTarget = '';
				let nx = targetData.x;
                let nz = targetData.z;
                do{
                    testTarget = '';
                    nx += dirX;
                    nz += dirZ;
                    for(let p = 0;p < mapData.array.length; p++){
                        if(mapData.array[p].name.xAxis == nx && mapData.array[p].name.zAxis == nz){
                            if(mapData.array[p].name.turn == pieceType.max - turn){
                                n++;
                                flippablePiece.temp.push(mapData.array[p]);
                                testTarget = mapData.array[p];
                                // console.log(testTarget);
                                break;
                            }else if(mapData.array[p].name.turn == turn){
                                m++;
                                break;
                            }
                        }
                    }
                }while(testTarget != '');
                // console.log('flippablePiece', flippablePiece);
                if(n > 0 && m > 0){
                    flippablePiece.fixed.concat(Array.from(flippablePiece.temp));
                    // flippablePiece.fixed.push(flippablePiece.temp.slice(0, flippablePiece.temp.length));
                    for(var s = 0; s < flippablePiece.temp.length; s++){
                        var temp_array = flippablePiece.temp.slice(0, flippablePiece.temp.length);
                        flippablePiece.fixed.push(temp_array[s]);
                    }
                }
                for(let q = 0; flippablePiece.temp.length; q++){
                    flippablePiece.temp.pop();
                }
            }
        }
        if(flippablePiece.fixed.length > 0){
            flipPiece(flippablePiece.fixed);
            // console.log('flippablePiece', flippablePiece);
            return true;
        }else{
            return false;
        }
    }

    function flipPiece(array){
        array.forEach(function(item){
            // console.log('flipPiece function', item);
            for(let r = 3; r < scene.children.length; r++){
                if(scene.children[r] == item){
                    var tm = new TimelineMax();
                    scene.children[r].name.turn = turn;
                    tm.to(scene.children[r].position, 0.1, {y: 30, ease:Power0.easeOut});
                    tm.to(scene.children[r].rotation, 0.3, {x: scene.children[r].rotation.x + Math.PI, ease:Power0.easeOut});
                    tm.to(scene.children[r].position, 0.1, {y: turn == pieceType.black ? pieceInfo.height : pieceInfo.height / 2, ease:Power0.easeOut});
                }
            }
        })
        
    }

    //クリック処理＝＝＝＝＝＝＝＝＝終了

    tick();

    function tick(){

        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}