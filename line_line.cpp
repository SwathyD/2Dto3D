#include <iostream>
#include <cmath>
#include <cstdio>
#include <cstdlib>

using namespace std;

typedef struct {
   double x,y,z;
} XYZ;

double EPS = 0; 

/*
   Calculate the line segment PaPb that is the shortest route between
   two lines P1P2 and P3P4. Calculate also the values of mua and mub where
      Pa = P1 + mua (P2 - P1)
      Pb = P3 + mub (P4 - P3)
   Return FALSE if no solution exists.
*/
int LineLineIntersect(
   XYZ p1,XYZ p2,XYZ p3,XYZ p4,XYZ *pa,XYZ *pb,
   double *mua, double *mub)
{
   XYZ p13,p43,p21;
   double d1343,d4321,d1321,d4343,d2121;
   double numer,denom;

   p13.x = p1.x - p3.x;
   p13.y = p1.y - p3.y;
   p13.z = p1.z - p3.z;
   p43.x = p4.x - p3.x;
   p43.y = p4.y - p3.y;
   p43.z = p4.z - p3.z;
   if (abs(p43.x) < EPS && abs(p43.y) < EPS && abs(p43.z) < EPS)
      return(false);
   p21.x = p2.x - p1.x;
   p21.y = p2.y - p1.y;
   p21.z = p2.z - p1.z;
   if (abs(p21.x) < EPS && abs(p21.y) < EPS && abs(p21.z) < EPS)
      return(false);

   d1343 = p13.x * p43.x + p13.y * p43.y + p13.z * p43.z;
   d4321 = p43.x * p21.x + p43.y * p21.y + p43.z * p21.z;
   d1321 = p13.x * p21.x + p13.y * p21.y + p13.z * p21.z;
   d4343 = p43.x * p43.x + p43.y * p43.y + p43.z * p43.z;
   d2121 = p21.x * p21.x + p21.y * p21.y + p21.z * p21.z;

   denom = d2121 * d4343 - d4321 * d4321;
   if (abs(denom) < EPS)
      return(false);
   numer = d1343 * d4321 - d1321 * d4343;

   *mua = numer / denom;
   *mub = (d1343 + d4321 * (*mua)) / d4343;

   pa->x = p1.x + *mua * p21.x;
   pa->y = p1.y + *mua * p21.y;
   pa->z = p1.z + *mua * p21.z;
   pb->x = p3.x + *mub * p43.x;
   pb->y = p3.y + *mub * p43.y;
   pb->z = p3.z + *mub * p43.z;

   return(true);
}

int main(){

   XYZ vertical_line_start;
   vertical_line_start.x =  2;
   vertical_line_start.y =  0;
   vertical_line_start.z =  0;

   XYZ vertical_line_end;
   vertical_line_end.x =  -2;
   vertical_line_end.y =   0;
   vertical_line_end.z =   0;

   XYZ horizontal_line_start;
   horizontal_line_start.x =  -1;
   horizontal_line_start.y =   0;
   horizontal_line_start.z =   0;

   XYZ horizontal_line_end;
   horizontal_line_end.x =  1;
   horizontal_line_end.y =  0;
   horizontal_line_end.z =  0;

   double mua, mub;
   XYZ pa, pb;

   LineLineIntersect(vertical_line_start, vertical_line_end, horizontal_line_start, horizontal_line_end, &pa, &pb, &mua, &mub);

   cout << "A " << pa.x << "," << pa.y << "," << pa.z << " - " << mua;
   cout << endl;
   cout << "B " << pb.x << "," << pb.y << "," << pb.z << " - " << mub;

   return 0;
}
