import * as THREE from 'three'
import {map, rayReceiveObjects, pieceInfo, pieceType, count, display} from './config';
import { Loader } from 'three';
//マス目ジオメトリ―を配置＝＝＝＝＝＝＝＝＝
export class Square {
    constructor(xAxis, zAxis, put){
        this.xAxis = xAxis;
        this.zAxis = zAxis;
        this.put = put
        this.position;
    };
    set(){
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(map.size, map.size, 1, 1), new THREE.MeshLambertMaterial({color:0x00ff00, side:THREE.DoubleSide}));
        const position = {
            x:(this.xAxis * map.size) + (this.xAxis * map.margin) - (map.size * map.x + map.margin * (map.x - 1))  / 2,
            z:(this.zAxis * map.size) + (this.zAxis * map.margin) - (map.size * map.z + map.margin * (map.z - 1))  / 2
        }
        
        plane.position.set( position.x, 0, position.z);
        this.position = plane.position;
        // plane.name = this.xAxis + " " + this.zAxis;
        plane.name = {
            'xAxis': this.xAxis,
            'zAxis': this.zAxis,
            'put': this.put
        };
        plane.rotation.x = -Math.PI / 2;
        rayReceiveObjects.push(plane);
        return plane;
    };
}

//駒置く処理＝＝＝＝＝＝＝＝＝
export class Piece {
    constructor(position, name, turn){
        this.position = position;
        this.name = name;
        this.turn = turn;
        this.group = new THREE.Group();
    }
    put(){
        // console.log('this.position', this.position);
        const mesh_black = new THREE.Mesh(
            new THREE.CylinderGeometry(pieceInfo.width, pieceInfo.width, pieceInfo.height / 2, 50),
            new THREE.MeshPhongMaterial({color:0x000000})
        );
        const mesh_white = new THREE.Mesh(
            new THREE.CylinderGeometry(pieceInfo.width, pieceInfo.width, pieceInfo.height / 2, 50),
            new THREE.MeshPhongMaterial({color:0xffffff})
        );
        // mesh_white.position.y = pieceInfo.height / 2;
        mesh_white.position.y = -pieceInfo.height / 2;
        this.group.add(mesh_black, mesh_white);
        this.name.turn = this.turn;
        this.group.name = this.name;
        console.log('piece position', this.group.position);
        console.log('piece name', this.group.name);
        this.group.position.set(this.position.x, pieceInfo.height,this.position.z);
        this.checkTurn(this.turn);
        return this.group;
    }
    checkTurn(){
        switch(this.turn){
            case pieceType.black:
                this.group.position.y = pieceInfo.height;
                this.group.rotation.x = 0;
                break;
            case pieceType.white:
                this.group.position.y = pieceInfo.height / 2;
                this.group.rotation.x = Math.PI;
                break;
            default:
                console.error('checkTurn function is out of order.')
        }
    }
}
//駒置く処理＝＝＝＝＝＝＝＝＝終了

//カウント処理＝＝＝＝＝＝＝＝＝
export function countPiece (array){
    console.log(array);
    let count = {
        black: 0,
        white: 0
    }
    array.forEach(function(item){
        let check = item.name.turn;
        switch (check){
            case 1:
                count.black++;
                break;
            case 2:
                count.white++;
                break;
            default :
                console.error('countPiece function is out of order.');
        }
    })
    return count;
}
//カウント処理＝＝＝＝＝＝＝＝＝


//カウント表示＝＝＝＝＝＝＝＝＝
export function countDisplay(array){
    let displayMesh = {};
    for(let key in array){
        const loader = new THREE.FontLoader();
        loader.load('helvetiker_regular.typeface.json', function(font){
            const geometry = new THREE.TextGeometry(key, {
                font:font,
                size: 80,
                height:5,
                curveSegment: 12
            })
            const material = [
                new THREE.MeshPhongMaterial({color:0xffffff}),
                new THREE.MeshPhongMaterial({color:Math.random() * 0xffffff})
            ];
            const mesh = new THREE.Mesh(geometry, material)
            mesh.rotation.x = -Math.PI / 2;
            displayMesh[key] = mesh;
            
        })
    }
    console.log(displayMesh);
    return displayMesh;
}