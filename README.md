

## Domain name:
### Front End:
#### Home Page  : https://movie-app-motphim.com
- Mua domain trên Hostinger
- Host web bằng AWS Amplify 
- Custom domain từ Hostinger sang AWS 

![image](https://i.postimg.cc/X7JqkDHZ/335549291-ca465ae9-875f-4228-9bc0-eb5541f38d8a.png)

### Back End:
#### Được deploy trên Render
#### Nodejs Back-end Server : https://jsserver-pi25.onrender.com
#### Python Back-end Server : https://pythonserver-6.onrender.com

Vì 2 Server BackEnd được deploy trên 2 máy chủ free với 0.1 GPU nên khá chậm và khi có những resquest đầu tiên dùng để yêu cầu như đăng nhập đăng kí tới thì cần một thời gian để server có thể restart và response data

#### Do có thể chậm trễ khi request data lúc đầu vì Server chưa được khởi động nên có thể sử dụng Postman để test
- Ví dụ về tiến hành đăng kí
![image](https://i.postimg.cc/brNtfYz8/Screenshot-2024-06-08-005003.png)
- Sau khi nhận được Response data thì có thể tiến hành vào web 1 cách bình thường

## Movie Web 
### Sơ đồ tính năng


### Đăng kí 
Ta sẽ tiến hành đăng kí dữ liệu với xác thực 2 bước với gmail vì nếu người dùng mất mật khẩu thì có thể gửi xác thực lại bằng gmail

![markdown](https://i.postimg.cc/qMTxkh3P/Screenshot-2024-05-29-152318.png)



### Đăng nhập
Ta sẽ tiến hành đăng nhập bằng gmail và tài khoản đã đăng kí Nếu đúng tài khoản và mật khẩu sẽ Login được vào Web

![markdown](https://i.postimg.cc/mrXmkLsQ/Screenshot-2024-05-29-151933.png)


### Đổi mật khẩu
Khi người dùng muốn tiến hành đổi mật khẩu thì người dùng có thể nhập gamil và mật khẩu mới cần đổi hệ thống sẽ tự gửi 1 gmail phản hồi với gmail người dùng nhập để yêu cầu người dùng tiến hành xác thực và sau khi xác thực thành công thì người dùng có thể đăng nhập vào bằng mật khẩu mới đổi

![markdown](https://i.postimg.cc/tT99qz91/Screenshot-2024-05-29-152531.png)


### 

### MainPage
#### Header
Đây là thanh chứa các mục mà người dùng có thể trải nghiệm trong 
![image](https://hackmd.io/_uploads/SkjFvwV4C.png)

#### Most View 
Đây là danh sách các phim được người dùng xem nhiều nhất vói số lượt xem được sắp xếp từ cao đến thấp
#### Highest Rating
Đây là danh sách các bộ phim được người dùng đánh giá sao được sắp xếp từ cao đến thấp
#### Các list khác
Đây là các list được tạo ra bởi 1 server do admin quản lí nhằm đem tới nhiều list phim đa dạng cho người dùng

##### Đây là hình ảnh 1 list
![image](https://i.postimg.cc/xCWDky2y/Screenshot-2024-05-29-153050.png)

### Movie and TV Series:
#### Giao diện chính 
Chứa các thanh tìm kiếm phim theo từ khóa hoặc thể loại và chứa danh sách các phim là Movie hoặc TV Series
##### Đây là hình ảnh của trang Movie:
![image](https://i.postimg.cc/13Zm7Sbc/Screenshot-2024-05-29-153801.png)
#### Chọn thể loại
Với mỗi bộ phim thuộc Movie hoặc TV Series thì người dùng có thể chọn thể loại tùy theo ý thích hệ thống sẽ tự động lấy Params bị thay đổi ở url để tiến hành truy vẫn phim theo yêu cầu 
##### Đây là hình ảnh của sau khi tìm kiếm theo thể loại 
![image](https://i.postimg.cc/m2V4j9NR/Screenshot-2024-05-29-154230.png)


#### Tìm kiếm theo từ khóa:

##### Filter Search:

Đây là hệ thống tự động tìm kiếm tự động khi người dùng gõ 1 ký tự mới trong thanh tìm kiếm server sẽ tự động query lại data và trả về cho người dùng

##### Đây là hình ảnh
![image](https://i.postimg.cc/GtHFfG8N/12.png)

#### Tìm kiếm sau khi gõ lệnh Search hoặc nhấn Enter:

Hệ thống sẽ tạo ra 1 url mới chứa params của data cần tìm kiếm và tìm kiếm ra 1 bộ phim thích hợp

##### Đây là hình ảnh khi ta tìm kiếm bộ phim bắt đầu bằng chữ k trong các bộ phim ở movie

![image](https://i.postimg.cc/FsScJ9jj/Screenshot-2024-05-29-155038.png)

### Detail từng Movie: 
Ta sẽ truy cập 1 url với 1 params là slug của 1 bộ phim Khi 
đó ta sẽ có giao diện như sau

![image](https://i.postimg.cc/nL6fMbBw/Screenshot-2024-05-29-161529.png)

#### Views:
Khi người dùng tiến hành truy cập thì số lượt view sẽ tự động tăng lên mục đích nhằm cập nhật lại List View

#### Đánh dấu sao:
Cho người dùng đánh sao theo ý thích

#### Comments:
Người dùng được để lại comments theo ý thích

![image](https://i.postimg.cc/hjHh15xX/Screenshot-2024-05-29-163015.png)

#### Recommend System :
Đây là hệ thống gợi ý các bộ phim người dùng có thể muốn xem dựa trên việc tranning model bằng machine learning với dữ liệu đầu vào là rating các bộ phim mà mọi người đã đánh giá
Từ đó hệ thống sẽ list ra các bộ phim mà người đung muốn xem

#### Đây là hình ảnh:
![image](https://i.postimg.cc/bNw4Rwy2/Screenshot-2024-05-29-163742.png)

#### Chuyển tiền 
Hệ thống sẽ có 1 số bộ phim miễn phí và một số bộ phim cần trả phí

![image](https://i.postimg.cc/1XyZVB5K/Screenshot-2024-05-30-084251.png)

Để tiến hành trả phí ta có thể chọn các gói mua khác nhau với các hạn mức sử dụng và khuyến mãi khác nhau

![image](https://i.postimg.cc/hvt5q5tN/Screenshot-2024-05-30-084605.png)

Ta sẽ tiến hành mua gói Gold

![image](https://i.postimg.cc/J4t26vgk/Screenshot-2024-05-30-084845.png)

Sau khi thanh toán thành công thì sẽ tiến hành update quyền và thời gian sử dụng gói trên database để từ đó người dùng được sử dụng tài nguyên của web

![image](https://i.ibb.co/YWpZRbq/Untitled.png)

#### Login bằng hệ thống nhận diện khuôn mặt
Hệ thống này ứng dụng các model được hỗ trên java-scripts bằng thư viện face-api 

Với mỗi người dùng khi tiến hành cập nhật hình ảnh cho Profile của mình thì sẽ được lưu vào firebase và khi tiến hành đăng nhập thì :
 
Hệ thống sẽ tiến hành tranning các model mà ta sử dụng như bao gồm 4 models
##### Tiny Face Detector:
Hỗ trợ realtime face detector . Với việc chỉ tốn kích cỡ 190KB phù hợp với hệ thống Web
##### Face Landmark Detection: 
Giup phát hiện 68 điểm trên khuôn mặt với kích cở 350KB
##### Face Recognition:
Map ra 1 vector đăc trưng có 128 giá trị với kích cỡ 6.2MB
##### FaceExpressionRecognition: 
Model này giúp nhận diện ra các biểu cảm trên khuôn mặt với kịc cỡ 310Kb

Sau đó ta sẽ query tất cả các ảnh của người dùng trên firebase và tiến hành tranning các ảnh đó bằng các models đã load được (Phần này lúc đầu em định tranning sẵn khi người dùng update 1 ảnh mới trong Profile nhưng vì server back end của em nó chỉ chạy trên 1 hệ thống 0.1 gpu nên khiến mọi thứ trong serve bị sập khi load các models còn khi để bên front end thì khi host web lên thì nó chỉ bị sập mỗi trang đó thôi )

Sau khi tranning tất cả các ảnh xong thì tiến hành cho người dùng sử dụng camera và hệ thống sẽ liên tục lấy các khung hình và tranning đến khi nhận diện thành công hoặc thất bại

Đây là demo nhận diện khuôn mặt bằng máy tính cá nhân:  [Link Here](https://drive.google.com/drive/folders/1_WtB-ErwXFrGGegqWpB6A4P8fex4RqFj?usp=sharing)


## Admin
Đây là trang dành chỉ dành cho admin để nhàm mục đích update dữ liệu 
### Login
Người sử dụng phải có quyền admin mới có thể tiến hành đăng nhập và sử dụng
![image](https://i.postimg.cc/X73rXF4D/Screenshot-2024-05-31-002710.png)


### MainPage
Trang chính sẽ hiển thị các số liệu như số lượng người đăng kí và thông tin người dùng

![image](https://i.postimg.cc/CM88RSDd/Screenshot-2024-05-31-002414.png)

### Movies 
Trang này sẽ quản lí các bộ phim hiện tại đang có trên database ta có thể thao tác với các dữ liệu này như xóa hoặc chỉnh sửa thông tin

![image](https://i.postimg.cc/3xqrjDQh/Screenshot-2024-05-31-003123.png)

#### Thêm dữ liệu cho movie: 
Đầu tiên ta sẽ lấy nguồn dữ liệu trên TMDB:

![image](https://i.postimg.cc/HWtpZN1B/Screenshot-2024-05-31-003819.png)

Sau đó ta sẽ tiến hành sử dụng các dữ liệu đó để tạo ra 1 bộ phim mới

Vì phim có các trường dữ liệu như hình ảnh và video nên ta sẽ sử dụng Firebase Storage 

Sau khi import thành công thì hệ thống sẽ trả về địa chỉ của dữ liệu được lưu trên Firebase và ta sẽ lưu database là Url đó

![image](https://i.postimg.cc/cHrbRrWp/Screenshot-2024-05-31-004756.png)

Sau đó ta sẽ vào Movie Web và kiểm tra và đã hiện ra bộ phim mới thêm

![image](https://i.postimg.cc/K8xp99Fr/Screenshot-2024-05-31-005642.png)



#### List Movie:

Ta sẽ được quản lí và tạo các list phim bằng cách gộp các bộ phim ta muốn lại


![image](https://i.postimg.cc/BZ2Cdxmh/Screenshot-2024-05-31-005945.png)

## Deploy và đánh giá
- Test trên Pagespeed





