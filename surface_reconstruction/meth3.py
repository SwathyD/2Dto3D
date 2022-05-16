import open3d as o3d

bunny = o3d.data.BunnyMesh()
gt_mesh = o3d.io.read_triangle_mesh(bunny.path)
gt_mesh.compute_vertex_normals()

pcd = gt_mesh.sample_points_poisson_disk(3000)
o3d.visualization.draw_geometries([pcd])

# with o3d.utility.VerbosityContextManager(o3d.utility.VerbosityLevel.Debug) as cm:
mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(pcd, depth=9)
o3d.visualization.draw_geometries([mesh])
o3d.visualization.draw_geometries([pcd], point_show_normal=True)