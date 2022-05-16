import open3d as o3d

pcd = o3d.io.read_point_cloud("pc_edited.xyz")
pcd.estimate_normals()
# # hull, _ = pcd.compute_convex_hull()
# # hull_ls = o3d.geometry.LineSet.create_from_triangle_mesh(hull)
# # hull_ls.paint_uniform_color((1, 0, 0))
# # o3d.visualization.draw_geometries([pcd, hull_ls], point_show_normal=True)

alpha = 0.3
print(f"alpha={alpha:.3f}")
mesh = o3d.geometry.TriangleMesh.create_from_point_cloud_alpha_shape(pcd, alpha)
mesh.filter_smooth_simple()
mesh.compute_vertex_normals()
o3d.visualization.draw_geometries([mesh], mesh_show_back_face=True)

# vis = o3d.visualization.VisualizerWithEditing()
# vis.create_window()
# vis.add_geometry(pcd)
# vis.run()  # user picks points
# vis.destroy_window()

# print()

# to_remove = vis.get_picked_points()

# with open("test.xyz", "r+") as file:
#     lines = file.readlines()
#     for idx in to_remove:
#         lines[idx] = ""

#     filtered_lines = filter(lambda line: len(line) > 0, lines)

#     file.writelines(lines)

# mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(pcd, depth=9)
# o3d.visualization.draw_geometries([mesh])
# to_remove = [0]

# while len(to_remove) > 0:
#     pcd = o3d.io.read_point_cloud("pc_edited.xyz")
#     pcd.estimate_normals()

#     vis = o3d.visualization.VisualizerWithEditing()
#     vis.create_window()
#     vis.add_geometry(pcd)
#     vis.run()  # user picks points
#     vis.destroy_window()

#     to_remove = vis.get_picked_points()

#     with open("pc_edited.xyz", "r+") as file:
#         lines = file.readlines()
#         for idx in to_remove:
#             lines[idx] = ""

#         filtered_lines = list(filter(lambda line: len(line) > 0, lines))

#         file.truncate(0)

#         file.seek(0)

#         file.writelines(filtered_lines)


#     o3d.visualization.draw_geometries([pcd], point_show_normal=True)
#     mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(pcd, depth=9)
#     o3d.visualization.draw_geometries([mesh])