import * as THREE from "three";

const Environment = {

    create_ground: ( mat_geo_x, mat_geo_y, mat_geo_z ) => {

        let geo_group = new THREE.Group();
        let geo_metry = new THREE.PlaneGeometry( 800, 450 );

        let geo_x = new THREE.Mesh( geo_metry, mat_geo_x );
        let geo_z = new THREE.Mesh( geo_metry, mat_geo_z );

        geo_metry = new THREE.PlaneGeometry( 800, 800 );
        geo_metry.rotateX( Math.PI/-2 );
        geo_metry.computeVertexNormals();

        let geo_y = new THREE.Mesh( geo_metry, mat_geo_y );
        geo_y.receiveShadow = true;

        // geo_y.rotateX(Math.PI/2);
        geo_z.rotateY( Math.PI / 2 );
        geo_x.position.set( 0, 225, -400 );
        geo_y.position.set( 0, 0, 0 );
        geo_z.position.set( -400, 225, 0 );
        geo_group.add( geo_x, geo_y, geo_z );
        geo_group.scale.set( 2, 2, 2 );

        return geo_group

    },

    create_bg: ( scene ) => {
        
        scene.background = new THREE.CubeTextureLoader()
            .setPath( '../src/skybox/sb001/' )
            .load([
                'px.png', 'nx.png',
                'py.png', 'ny.png',
                'pz.png', 'nz.png'
            ]);

    },


}

export default Environment